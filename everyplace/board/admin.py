from django.contrib import admin
from .models import Board, BoardTag, BoardLike, BoardComment

admin.site.register(Board)
admin.site.register(BoardTag)
admin.site.register(BoardLike)
admin.site.register(BoardComment)
