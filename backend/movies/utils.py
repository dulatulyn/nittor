from rest_framework_simplejwt.tokens import RefreshToken


def create_access_token(user):
    refresh = RefreshToken.for_user(user)
    return str(refresh.access_token)


def hd_poster_url(url):
    if not url or '._V1_' not in url:
        return url
    return url.split('._V1_')[0] + '._V1_.jpg'
