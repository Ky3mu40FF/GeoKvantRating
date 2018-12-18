using System;
using System.Collections.Generic;
using NetTopologySuite.Geometries;

namespace GeoKvantRating.Models
{
    public partial class GeokvantumLocations
    {
        public int GeokvantumLocationsId { get; set; }
        public string City { get; set; }
        public string ExtraName { get; set; }
        public int GeokvantumInfoFk { get; set; }
        public Point KvantoriumPosition { get; set; }

        public GeokvantumInfo GeokvantumInfoFkNavigation { get; set; }
    }
}
