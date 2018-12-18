using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Sheets.v4;
using Google.Apis.Sheets.v4.Data;
using Google.Apis.Services;
using Google.Apis.Util.Store;

namespace GeoKvantRating.ExtraClasses
{
    public class GoogleSheets
    {
        //static string[] Scopes = { SheetsService.Scope.SpreadsheetsReadonly };
        static string[] Scopes = { SheetsService.Scope.Spreadsheets };
        static readonly string ApplicationName = "GeoRating";
        public static readonly string SpreadsheetId = "1FHkpYM-NFajrnKM31tLn41h8whPinSli7fGzsDpLB5o";
        public SheetsService SheetsService;

        private SheetsService CreateService(string apiKey)
        {

            var service = new SheetsService(new BaseClientService.Initializer()
            {
                ApiKey = apiKey,
                ApplicationName = ApplicationName
            });
            return service;
        }

        public GoogleSheets(string apiKey)
        {
            SheetsService = CreateService(apiKey);
        }
        
    }
}
