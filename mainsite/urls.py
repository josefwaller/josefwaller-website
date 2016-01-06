from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.IndexView.as_view(), name="index"),
    url(r'^evolution/$', views.EvolutionView.as_view(), name="evolution"),
    url(r'^graphics/$', views.GraphicsView.as_view(), name="graphics"),
    url(r'^rocket/$', views.RocketView.as_view(), name="rocket"),

    url(r'^evolution_save/$', views.save_evolution, name="save evolution"),
    url(r'^evolution_get/$', views.get_evolution_save, name='get evolution save')
]