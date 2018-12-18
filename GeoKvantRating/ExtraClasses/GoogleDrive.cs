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
using Google.Apis.Drive.v3;
using Google.Apis.Drive.v3.Data;

namespace GeoKvantRating.ExtraClasses
{
    public class GoogleDrive
    {
        static string[] Scopes = { DriveService.Scope.DriveMetadataReadonly };
        static string ApplicationName = "GeoRating";
        public static readonly string SpreadsheetId = "1FHkpYM-NFajrnKM31tLn41h8whPinSli7fGzsDpLB5o";
        public DriveService DriveService;

        private DriveService CreateService(string apiKey)
        {
            var service = new DriveService(new BaseClientService.Initializer()
            {
                ApiKey = apiKey,
                ApplicationName = ApplicationName,
            });
            return service;
        }

        public GoogleDrive(string apiKey)
        {
            DriveService = CreateService(apiKey);
        }
    }
}
