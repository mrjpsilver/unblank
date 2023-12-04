from django.shortcuts import render
from django.views.decorators.http import require_POST

def home(request):
    return render(request, 'pages/home.html')

@require_POST
def search_form(request):
    action = request.POST.get('action', '//www.google.com/search')
    q = request.POST.get('q', '')
    return render(request, 'partials/_htmx-form.html', {
        'post': request.POST.dict(),
        'action': action,
        'q': q,
    })