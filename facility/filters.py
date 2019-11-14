from django.filter import FilterSet
from .models import FeatureBuilding, FeatureWaterPoint

class BuildingFilter(FilterSet):
    class Meta:
        model = FeatureBuilding
        fields = ['height','capacity','use','area','block']

class WaterPointFilter(FilterSet):
    class Meta:
        model = FeatureWaterPoint
        fields = ['name','type']
