from .models import FeatureBuilding,FeatureWaterPoint, FeatureStreetLights
from django.forms import ModelForm
from django import forms
from leaflet.forms.widgets import LeafletWidget

class BuilldingForm(ModelForm):
    class Meta:
        model = FeatureBuilding
        exclude = ['geom']

class WaterPointForm(ModelForm):
    class Meta:
        model = FeatureWaterPoint
        fields ='__all__'
        widgets = {'geom' : LeafletWidget()}


class StreetLightForm(ModelForm):
    class Meta:
        model = FeatureStreetLights
        fields ='__all__'
        widgets = {'geom' : LeafletWidget()}

class SpatialSearchForm(forms.Form):
    layer_choice = (
    ('W','Water Point'),
    ('E','Street Light'),
    ('SP','Sitting Point')
    )

    distance = forms.IntegerField()
    layer = forms.MultipleChoiceField(widget=forms.CheckboxSelectMultiple(),choices=layer_choice)

class RoomSearchForm(forms.Form):
    use_choice = (('L','Lecture Hall'),('O','Office'))
    block_choice = (('A','Academic Block'),('A','Resource Centre'))
    #Use of queryset form the models to extreact umique values
    use = forms.MultipleChoiceField(widget=forms.CheckboxSelectMultiple(),choices= use_choice)
    capacity = forms.IntegerField()
    block = forms.MultipleChoiceField(widget=forms.CheckboxSelectMultiple(),choices=block_choice)
