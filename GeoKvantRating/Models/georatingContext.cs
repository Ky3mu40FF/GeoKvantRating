using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace GeoKvantRating.Models
{
    public partial class georatingContext : DbContext
    {
        /*
        public georatingContext()
        {
        }

        public georatingContext(DbContextOptions<georatingContext> options)
            : base(options)
        {
        }
        */

        public virtual DbSet<GeokvantumInfo> GeokvantumInfo { get; set; }
        public virtual DbSet<GeokvantumLocations> GeokvantumLocations { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            /* Geokvantum_Sk */
            /*
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseNpgsql("Host=localhost;Port=5433;Database=georating;Username=postgres;Password=geo_555_pgsql",
                    o => o.UseNetTopologySuite());
            }
            */

            /* Home PgSQL */
            /*
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseNpgsql("Host=192.168.1.52;Port=5432;Database=georating;Username=postgres;Password=mag_StreetLight_pg_adm_2k18",
                    o => o.UseNetTopologySuite());
            }
            */
            /* Home Ky3mu40FF-PC */
            
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=georating;Username=postgres;Password=mag_StreetLight_pg_adm_2k18",
                    o => o.UseNetTopologySuite());
            }
            
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasPostgresExtension("postgis")
                .HasPostgresExtension("postgis_topology");

            modelBuilder.Entity<GeokvantumInfo>(entity =>
            {
                entity.ToTable("geokvantum_info", "regions_data");

                entity.Property(e => e.GeokvantumInfoId)
                    .HasColumnName("geokvantum_info_id")
                    .HasDefaultValueSql("nextval('regions_data.geokvantum_info_geokvantum_info_id_seq'::regclass)");

                entity.Property(e => e.KvantoriumAddress)
                    .HasColumnName("kvantorium_address")
                    .HasColumnType("character varying");

                entity.Property(e => e.SheetId).HasColumnName("sheet_id");

                entity.Property(e => e.Site)
                    .HasColumnName("site")
                    .HasColumnType("character varying");

                entity.Property(e => e.TutorsFullNames).HasColumnName("tutors_full_names");

            });

            modelBuilder.Entity<GeokvantumLocations>(entity =>
            {
                entity.ToTable("geokvantum_locations", "regions_data");

                entity.Property(e => e.GeokvantumLocationsId)
                    .HasColumnName("geokvantum_locations_id")
                    .HasDefaultValueSql("nextval('regions_data.geokvantum_locations_geokvantum_locations_id_seq'::regclass)");

                entity.Property(e => e.City)
                    .IsRequired()
                    .HasColumnName("city")
                    .HasColumnType("character varying");

                entity.Property(e => e.ExtraName)
                    .HasColumnName("extra_name")
                    .HasColumnType("character varying");

                entity.Property(e => e.KvantoriumPosition)
                    .HasColumnName("kvantorium_position");

                entity.Property(e => e.GeokvantumInfoFk).HasColumnName("geokvantum_info_fk");

                entity.HasOne(d => d.GeokvantumInfoFkNavigation)
                    .WithMany(p => p.GeokvantumLocations)
                    .HasForeignKey(d => d.GeokvantumInfoFk)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("geokvantum_locations_geokvantum_info_fkey");
            });

            modelBuilder.HasSequence<int>("geokvantum_info_geokvantum_info_id_seq");

            modelBuilder.HasSequence<int>("geokvantum_locations_geokvantum_locations_id_seq");
        }
    }
}
