from django.filter import FilterSet
from .models import FeatureBuilding

class BuildingFilter(FilterSet):
    class Meta:
        model = FeatureBuilding
        fields = ['height','capacity','use','area']
