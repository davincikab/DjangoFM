from django.contrib.gis.db import models

class FeatureBins(models.Model):
    gid = models.AutoField(primary_key=True)
    id = models.BigIntegerField(blank=True, null=True)
    name = models.CharField(max_length=80, blank=True, null=True)
    size = models.CharField(max_length=80, blank=True, null=True)
    status = models.CharField(max_length=80, blank=True, null=True)
    maintance_field = models.CharField(db_column='maintance_', max_length=80, blank=True, null=True)  # Field renamed because it ended with '_'.
    geom = models.PointField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'feature_bins'


class FeatureBomaArea(models.Model):
    gid = models.AutoField(primary_key=True)
    fid_field = models.BigIntegerField(db_column='fid_', blank=True, null=True)  # Field renamed because it ended with '_'.
    entity = models.CharField(max_length=16, blank=True, null=True)
    layer = models.CharField(max_length=254, blank=True, null=True)
    color = models.BigIntegerField(blank=True, null=True)
    linetype = models.CharField(max_length=254, blank=True, null=True)
    elevation = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    linewt = models.BigIntegerField(blank=True, null=True)
    refname = models.CharField(max_length=254, blank=True, null=True)
    geom = models.MultiLineStringField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'feature_boma_area'


class FeatureBoundary(models.Model):
    gid = models.AutoField(primary_key=True)
    id = models.IntegerField(blank=True, null=True)
    geom = models.MultiLineStringField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'feature_boundary'


class FeatureBuilding(models.Model):
    gid = models.AutoField(primary_key=True)
    id = models.BigIntegerField(blank=True, null=True)
    name = models.CharField(max_length=254, blank=True, null=True)
    id_1 = models.BigIntegerField(blank=True, null=True)
    height = models.BigIntegerField(blank=True, null=True)
    window = models.SmallIntegerField(blank=True, null=True)
    door = models.IntegerField(blank=True, null=True)
    sockets = models.SmallIntegerField(blank=True, null=True)
    department = models.CharField(max_length=254, blank=True, null=True)
    area = models.FloatField(blank=True, null=True)
    use = models.CharField(max_length=254, blank=True, null=True)
    comm_port = models.IntegerField(blank=True, null=True)
    capacity = models.SmallIntegerField(blank=True, null=True)
    bulbqty = models.SmallIntegerField(blank=True, null=True)
    tap = models.SmallIntegerField(blank=True, null=True)
    maintenace = models.CharField(max_length=254, blank=True, null=True)
    sec_light = models.SmallIntegerField(blank=True, null=True)
    level = models.SmallIntegerField(blank=True, null=True)
    block = models.CharField(max_length=80, blank=True, null=True)
    names = models.CharField(max_length=254, blank=True, null=True)
    geom = models.MultiPolygonField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'feature_building'


class FeatureBushes(models.Model):
    gid = models.AutoField(primary_key=True)
    id = models.IntegerField(blank=True, null=True)
    names = models.CharField(max_length=25, blank=True, null=True)
    geom = models.MultiPolygonField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'feature_bushes'


class FeatureCoffeePlantation(models.Model):
    gid = models.AutoField(primary_key=True)
    id = models.IntegerField(blank=True, null=True)
    names = models.CharField(max_length=25, blank=True, null=True)
    geom = models.MultiPolygonField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'feature_coffee_plantation'

class FeatureCulverts(models.Model):
    gid = models.AutoField(primary_key=True)
    id = models.BigIntegerField(blank=True, null=True)
    name = models.CharField(max_length=80, blank=True, null=True)
    length = models.CharField(max_length=80, blank=True, null=True)
    status = models.CharField(max_length=80, blank=True, null=True)
    geom = models.PointField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'feature_culverts'


class FeatureFieldSeats(models.Model):
    gid = models.AutoField(primary_key=True)
    id = models.BigIntegerField(blank=True, null=True)
    capacity = models.CharField(max_length=80, blank=True, null=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    geom = models.PointField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'feature_field_seats'


class FeatureFootballPitch(models.Model):
    gid = models.AutoField(primary_key=True)
    id = models.FloatField(blank=True, null=True)
    names = models.CharField(max_length=14, blank=True, null=True)
    r = models.FloatField(blank=True, null=True)
    g = models.FloatField(blank=True, null=True)
    b = models.FloatField(blank=True, null=True)
    geom = models.MultiPolygonField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'feature_football_pitch'


class FeatureFootpath(models.Model):
    gid = models.AutoField(primary_key=True)
    id = models.IntegerField(blank=True, null=True)
    geom = models.MultiLineStringField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'feature_footpath'


class FeatureForest(models.Model):
    gid = models.AutoField(primary_key=True)
    id = models.IntegerField(blank=True, null=True)
    names = models.CharField(max_length=25, blank=True, null=True)
    geom = models.MultiPolygonField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'feature_forest'


class Road(models.Model):
    gid = models.AutoField(primary_key=True)
    objectid = models.BigIntegerField(blank=True, null=True)
    surface = models.CharField(max_length=254, blank=True, null=True)
    walk_speed = models.BigIntegerField(blank=True, null=True)
    cycle_spee = models.BigIntegerField(blank=True, null=True)
    distance = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    way = models.BigIntegerField(blank=True, null=True)
    type = models.CharField(max_length=254, blank=True, null=True)
    id = models.BigIntegerField(blank=True, null=True)
    drive_spee = models.BigIntegerField(blank=True, null=True)
    source = models.SmallIntegerField(blank=True, null=True)
    target = models.SmallIntegerField(blank=True, null=True)
    geom = models.MultiLineStringField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'road'


class FeatureGates(models.Model):
    gid = models.AutoField(primary_key=True)
    id = models.BigIntegerField(blank=True, null=True)
    name = models.CharField(max_length=80, blank=True, null=True)
    sec_person = models.BigIntegerField(blank=True, null=True)
    geom = models.PointField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'feature_gates'


class FeatureGazibo(models.Model):
    gid = models.AutoField(primary_key=True)
    id = models.BigIntegerField(blank=True, null=True)
    name = models.CharField(max_length=80, blank=True, null=True)
    sockets = models.CharField(max_length=80, blank=True, null=True)
    capacity = models.CharField(max_length=80, blank=True, null=True)
    status = models.CharField(max_length=80, blank=True, null=True)
    geom = models.PointField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'feature_gazibo'


class FeatureHistoricalTree(models.Model):
    gid = models.AutoField(primary_key=True)
    id = models.BigIntegerField(blank=True, null=True)
    name = models.CharField(max_length=80, blank=True, null=True)
    age = models.CharField(max_length=80, blank=True, null=True)
    height = models.CharField(max_length=80, blank=True, null=True)
    status = models.CharField(max_length=80, blank=True, null=True)
    geom = models.PointField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'feature_historical_tree'


class FeatureKabiruini(models.Model):
    gid = models.AutoField(primary_key=True)
    id = models.IntegerField(blank=True, null=True)
    geom = models.MultiPolygonField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'feature_kabiruini'


class FeatureMaizePlantation(models.Model):
    gid = models.AutoField(primary_key=True)
    id = models.IntegerField(blank=True, null=True)
    name = models.CharField(max_length=25, blank=True, null=True)
    geom = models.MultiPolygonField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'feature_maize_plantation'


class FeatureNyeriforest(models.Model):
    gid = models.AutoField(primary_key=True)
    id = models.IntegerField(blank=True, null=True)
    geom = models.MultiPolygonField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'feature_nyeriforest'


class FeatureParking(models.Model):
    gid = models.AutoField(primary_key=True)
    id = models.IntegerField(blank=True, null=True)
    names = models.CharField(max_length=20, blank=True, null=True)
    spots = models.SmallIntegerField(blank=True, null=True)

    geom = models.MultiPolygonField(blank=True, null=True)
    class Meta:
        managed = False
        db_table = 'feature_parking'


class FeaturePonds(models.Model):
    gid = models.AutoField(primary_key=True)
    id = models.IntegerField(blank=True, null=True)
    names = models.CharField(max_length=25, blank=True, null=True)
    geom = models.MultiPolygonField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'feature_ponds'


class FeatureRds(models.Model):
    gid = models.AutoField(primary_key=True)
    objectid = models.BigIntegerField(blank=True, null=True)
    shape_leng = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    lntype = models.BigIntegerField(blank=True, null=True)
    leftln_fid = models.BigIntegerField(blank=True, null=True)
    rightln_fi = models.BigIntegerField(blank=True, null=True)
    surface = models.CharField(max_length=254, blank=True, null=True)
    walk_speed = models.BigIntegerField(blank=True, null=True)
    cycle_spee = models.BigIntegerField(blank=True, null=True)
    distance = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    way = models.BigIntegerField(blank=True, null=True)
    type = models.CharField(max_length=254, blank=True, null=True)
    id = models.BigIntegerField(blank=True, null=True)
    drive_spee = models.BigIntegerField(blank=True, null=True)
    geom = models.MultiLineStringField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'feature_rds'


class FeatureSciencepark(models.Model):
    gid = models.AutoField(primary_key=True)
    oid_field = models.IntegerField(db_column='oid_', blank=True, null=True)  # Field renamed because it ended with '_'.
    name = models.CharField(max_length=254, blank=True, null=True)
    folderpath = models.CharField(max_length=254, blank=True, null=True)
    symbolid = models.IntegerField(blank=True, null=True)
    altmode = models.SmallIntegerField(blank=True, null=True)
    base = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    clamped = models.SmallIntegerField(blank=True, null=True)
    extruded = models.SmallIntegerField(blank=True, null=True)
    snippet = models.CharField(max_length=254, blank=True, null=True)
    popupinfo = models.CharField(max_length=254, blank=True, null=True)
    shape_leng = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    shape_area = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    names = models.CharField(max_length=25, blank=True, null=True)
    geom = models.MultiPolygonField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'feature_sciencepark'


class FeatureScpRoad(models.Model):
    gid = models.AutoField(primary_key=True)
    entity = models.CharField(max_length=16, blank=True, null=True)
    layer = models.CharField(max_length=254, blank=True, null=True)
    color = models.BigIntegerField(blank=True, null=True)
    refname = models.CharField(max_length=254, blank=True, null=True)
    geom = models.MultiLineStringField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'feature_scp_road'


class FeatureScpblocks(models.Model):
    gid = models.AutoField(primary_key=True)
    id = models.IntegerField(blank=True, null=True)
    name = models.CharField(max_length=50, blank=True, null=True)
    area_ha = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    use = models.CharField(max_length=50, blank=True, null=True)
    color = models.CharField(max_length=80, blank=True, null=True)

    geom = models.MultiPolygonField(blank=True, null=True)
    class Meta:
        managed = False
        db_table = 'feature_scpblocks'


class FeatureSecurityStations(models.Model):
    gid = models.AutoField(primary_key=True)
    id = models.BigIntegerField(blank=True, null=True)
    name = models.CharField(max_length=80, blank=True, null=True)
    status = models.CharField(max_length=80, blank=True, null=True)
    geom = models.PointField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'feature_security_stations'


class FeatureSepticTank(models.Model):
    gid = models.AutoField(primary_key=True)
    id = models.BigIntegerField(blank=True, null=True)
    name = models.CharField(max_length=80, blank=True, null=True)
    area = models.CharField(max_length=80, blank=True, null=True)
    depth = models.CharField(max_length=80, blank=True, null=True)
    status = models.CharField(max_length=80, blank=True, null=True)
    geom = models.GeometryField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'feature_septic_tank'


class FeatureSittingPoints(models.Model):
    gid = models.AutoField(primary_key=True)
    id = models.BigIntegerField(blank=True, null=True)
    name = models.CharField(max_length=80, blank=True, null=True)
    geom = models.GeometryField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'feature_sitting_points'


class FeatureStreetLights(models.Model):
    gid = models.AutoField(primary_key=True)
    id = models.BigIntegerField(blank=True, null=True)
    name = models.CharField(max_length=80, blank=True, null=True)
    type = models.CharField(max_length=80, blank=True, null=True)
    height = models.CharField(max_length=80, blank=True, null=True)
    bulb_type = models.CharField(max_length=80, blank=True, null=True)
    block = models.CharField(max_length=254, blank=True, null=True)
    geom = models.PointField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'feature_street_lights'


class FeatureToilets(models.Model):
    gid = models.AutoField(primary_key=True)
    id = models.IntegerField(blank=True, null=True)
    names = models.CharField(max_length=20, blank=True, null=True)
    geom = models.MultiPolygonField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'feature_toilets'


class FeatureWaterPoint(models.Model):
    gid = models.AutoField(primary_key=True)
    id = models.BigIntegerField(blank=True, null=True)
    name = models.CharField(max_length=80, blank=True, null=True)
    type = models.CharField(max_length=254, blank=True, null=True)
    geom = models.PointField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'feature_water_point'
