using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using GeoKvantRating.Models;
using System.Text;
using Microsoft.EntityFrameworkCore;
using GeoKvantRating.ExtraClasses;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Sheets.v4;
using Google.Apis.Sheets.v4.Data;
using Google.Apis.Services;
using Google.Apis.Util.Store;
using Google.Apis.Drive.v3;
using Google.Apis.Drive.v3.Data;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;


namespace GeoKvantRating.Controllers
{
    public class HomeController : Controller
    {
        georatingContext db;
        GoogleSheets gS;
        GoogleDrive gD;
        IConfiguration _configuration;

        //public HomeController(georatingContext context)
        public HomeController(georatingContext context, IConfiguration configuration)
        {
            db = context;
            _configuration = configuration;
            gS = new GoogleSheets(_configuration["Georating_GoogleSheetsApiKey"]);
            gD = new GoogleDrive(_configuration["Georating_GoogleSheetsApiKey"]);

        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult About()
        {
            ViewData["Message"] = "Your application description page.";

            return View();
        }

        public IActionResult Contact()
        {
            ViewData["Message"] = "Your contact page.";

            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }
        


        /* Выдача GeoJSON файла с точками, показывающими местоположение всех геоквантумов с базовой информацией */
        [HttpGet]
        public string GetAllGeoKvantumsPositions()
        {
            var kvantums = db.GeokvantumLocations.ToList();
            GeoJSON.Net.Feature.FeatureCollection kvCol = new GeoJSON.Net.Feature.FeatureCollection();
            GeoJSON.Net.Geometry.Position position;
            Dictionary<string, dynamic> properties;
            foreach(var kvantum in kvantums)
            {
                position = null;
                properties = new Dictionary<string, dynamic>();

                position = new GeoJSON.Net.Geometry.Position(
                    kvantum.KvantoriumPosition.Y,
                    kvantum.KvantoriumPosition.X
                    );

                properties.Add("geokvantum_locations_id", kvantum.GeokvantumLocationsId);
                properties.Add("city", kvantum.City);
                properties.Add("extra_name", kvantum.ExtraName);
                properties.Add("geokvantum_info_fk", kvantum.GeokvantumInfoFk);

                kvCol.Features.Add(
                    new GeoJSON.Net.Feature.Feature(
                        new GeoJSON.Net.Geometry.Point(position),
                        properties,
                        kvantum.GeokvantumLocationsId.ToString()
                    ));
            }
            return JsonConvert.SerializeObject(kvCol);
        }
        /* Выдача GeoJSON файла с точками, показывающими местоположение всех геоквантумов с базовой информацией */
        /* + базовый рейтинг (считывается из Google Sheets). Идёт отдельно, т.к. загрузка всех данных из Google */
        /* сильно тормозит получение слоя */
        [HttpGet]
        public string GetAllGeoKvantumsPositionsWithRating()
        {
            var kvantums = db.GeokvantumLocations.ToList();
            GeoJSON.Net.Feature.FeatureCollection kvCol = new GeoJSON.Net.Feature.FeatureCollection();
            GeoJSON.Net.Geometry.Position position;
            Dictionary<string, dynamic> properties;
            foreach (var kvantum in kvantums)
            {
                position = null;
                properties = new Dictionary<string, dynamic>();

                position = new GeoJSON.Net.Geometry.Position(
                    kvantum.KvantoriumPosition.Y,
                    kvantum.KvantoriumPosition.X
                    );

                int baseRating = GetGeokvantumRating(kvantum.GeokvantumLocationsId);

                properties.Add("geokvantum_locations_id", kvantum.GeokvantumLocationsId);
                properties.Add("city", kvantum.City);
                properties.Add("extra_name", kvantum.ExtraName);
                properties.Add("geokvantum_info_fk", kvantum.GeokvantumInfoFk);
                properties.Add("base_rating_done", baseRating);
                properties.Add("base_rating_not_done", 8 - baseRating);

                kvCol.Features.Add(
                    new GeoJSON.Net.Feature.Feature(
                        new GeoJSON.Net.Geometry.Point(position),
                        properties,
                        kvantum.GeokvantumLocationsId.ToString()
                    ));
            }
            return JsonConvert.SerializeObject(kvCol);
        }

        /* Получение базового рейтинга геоквантума по его id из БД */
        [HttpGet]
        public int GetGeokvantumRating(int id)
        {
            int rating = 0;
            var selectedGeokvantum = db.GeokvantumLocations.Include(kv => kv.GeokvantumInfoFkNavigation).Where(k => k.GeokvantumLocationsId == id).FirstOrDefault();
            string sheetName = selectedGeokvantum.City;
            if (selectedGeokvantum.ExtraName != null && selectedGeokvantum.ExtraName != "")
            {
                sheetName += " (" + selectedGeokvantum.ExtraName + ")";
            }

            //GoogleSheets gS = new GoogleSheets();
            SpreadsheetsResource.ValuesResource.GetRequest request =
                gS.SheetsService.Spreadsheets.Values.Get(GoogleSheets.SpreadsheetId, sheetName + "!D2:D9");
            try
            {
                ValueRange response = request.Execute();
                IList<IList<Object>> values = response.Values;
                if (values != null && values.Count > 0)
                {
                    foreach (var row in values)
                    {
                        Console.WriteLine("{0}", row[0]);
                        rating += row[0].ToString() == "TRUE" ? 1 : 0;
                    }
                }
                else
                {
                    rating = -1;
                }
            } catch(Exception ex)
            {
                return -1;
            }

            return rating;
        }

        /* Получение доп информации о геоквантуме по его id из БД */
        [HttpGet]
        public string GetAdditionalInfoForGeokvantum(int id)
        {
            int rating = 0;
            var selectedGeokvantum = db.GeokvantumLocations.Include(kv => kv.GeokvantumInfoFkNavigation).Where(k => k.GeokvantumLocationsId == id).FirstOrDefault();
            Dictionary<string, dynamic> properties = new Dictionary<string, dynamic>();
            Dictionary<string, dynamic> doneJobs = new Dictionary<string, dynamic>();
            properties.Add("address", selectedGeokvantum.GeokvantumInfoFkNavigation.KvantoriumAddress);
            properties.Add("site", selectedGeokvantum.GeokvantumInfoFkNavigation.Site);
            properties.Add("tutors_full_names", selectedGeokvantum.GeokvantumInfoFkNavigation.TutorsFullNames);

            string sheetName = selectedGeokvantum.City;
            if (selectedGeokvantum.ExtraName != null && selectedGeokvantum.ExtraName != "")
            {
                sheetName += " (" + selectedGeokvantum.ExtraName + ")";
            }


            SpreadsheetsResource.ValuesResource.GetRequest request =
                gS.SheetsService.Spreadsheets.Values.Get(GoogleSheets.SpreadsheetId, sheetName + "!B2:D9");
            ValueRange response = request.Execute();
            IList<IList<Object>> values = response.Values;
            if (values != null && values.Count > 0)
            {
                foreach (var row in values)
                {
                    if (row.Count > 0 && row[2].ToString() == "TRUE")
                    {
                        Console.WriteLine(row[0].ToString());
                        doneJobs.Add(row[0].ToString(), row[1].ToString());
                        rating++;
                    }
                }
                properties.Add("done_jobs", doneJobs);
                properties.Add("base_rating_done", rating);
                properties.Add("base_rating_not_done", 8 - rating);
            }
            else
            {
                rating = -1;
            }

            //return "";
            return JsonConvert.SerializeObject(properties);
        }


        /* ----------- Тестовые методы для проверки работоспособности компонентов ----------- */
        /* Метод для вывода данных из БД с целью проверки связи с БД */
        [HttpGet]
        public string TestDbAccess()
        {
            StringBuilder sB = new StringBuilder();
            var kvants = db.GeokvantumLocations.Include(kv => kv.GeokvantumInfoFkNavigation);
            foreach(var kvant in kvants)
            {             
                sB.Append(kvant.City + " (" + kvant.ExtraName + ") (X: " + kvant.KvantoriumPosition.X + ", Y: " + kvant.KvantoriumPosition.Y + ", SRID: " + kvant.KvantoriumPosition.SRID +
                    ") Address: " + kvant.GeokvantumInfoFkNavigation.KvantoriumAddress + "; Site: " + kvant.GeokvantumInfoFkNavigation.Site + "; SheetID: " + kvant.GeokvantumInfoFkNavigation.SheetId + "\n");
            }
            return sB.ToString();
        }
        /* Проверка корректной связи с сервисами Google */
        [HttpGet]
        public int TestGetRatingOfRegion(string name)
        {
            int rating = 0;
            var selKv = db.GeokvantumLocations.Include(kv => kv.GeokvantumInfoFkNavigation).Where(k => k.City == name).FirstOrDefault();
            //string sheetName = selKv.City + " (" + selKv.ExtraName + ")";
            string sheetName = selKv.City;
            if (selKv.ExtraName != null && selKv.ExtraName != "") {
                sheetName += " (" + selKv.ExtraName + ")";
            }
            //GoogleSheets gS = new GoogleSheets();
            SpreadsheetsResource.ValuesResource.GetRequest request =
                gS.SheetsService.Spreadsheets.Values.Get(GoogleSheets.SpreadsheetId, sheetName+"!D2:D9");

            ValueRange response = request.Execute();
            IList<IList<Object>> values = response.Values;
            if (values != null && values.Count > 0)
            {
                foreach (var row in values)
                {
                    // Print columns A and E, which correspond to indices 0 and 4.
                    Console.WriteLine("{0}", row[0]);
                    rating += row[0].ToString() == "TRUE" ? 1 : 0;
                }
            }
            else
            {
                rating = -1;
            }

            return rating;
        }

        [HttpGet]
        public string TestFindDoc(string name)
        {
            FilesResource.ListRequest listRequest = gD.DriveService.Files.List();
            FilesResource.GetRequest getRequest = gD.DriveService.Files.Get("1nvEb5AaWvadTP4Ddbe7FMVLluRidbuWMLnVjSUQlfns");
            listRequest.Key = gD.DriveService.ApiKey;
            //listRequest.Q = "name contains '" + name + "'";
            string hhh = getRequest.Execute().Name;
            
            IList<Google.Apis.Drive.v3.Data.File> files = listRequest.Execute().Files;
            Console.WriteLine("Files:");
            if (files != null && files.Count > 0)
            {
                foreach (var file in files)
                {
                    Console.WriteLine("{0} ({1})", file.Name, file.Id);
                }
            }
            else
            {
                Console.WriteLine("No files found.");
            }
            
            //return "";
            return hhh;
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
