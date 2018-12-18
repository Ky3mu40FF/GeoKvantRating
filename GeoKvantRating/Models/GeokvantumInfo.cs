using System;
using System.Collections.Generic;

namespace GeoKvantRating.Models
{
    public partial class GeokvantumInfo
    {
        public GeokvantumInfo()
        {
            GeokvantumLocations = new HashSet<GeokvantumLocations>();
        }

        public int GeokvantumInfoId { get; set; }
        public string KvantoriumAddress { get; set; }
        public string Site { get; set; }
        public int SheetId { get; set; }
        public string[] TutorsFullNames { get; set; }

        public ICollection<GeokvantumLocations> GeokvantumLocations { get; set; }
    }
}
