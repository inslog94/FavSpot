def custom_preprocessing_hook(endpoints):
    filtered = []
    for (path, path_regex, method, callback) in endpoints:
        if not (path == "/board/{pk}/" and method == "POST") and not (path == "/board/" and method == "PUT") and not (path == "/board/" and method == "DELETE") and not (path == "/board/{pk}/comment/" and method == "DELETE") and not (path == "/board/comment/{pk}/" and method == "POST") and not (path == "/board/{pk}/like/" and method == "GET") and not (path == "/board/{pk}/like/" and method == "DELETE") and not (path == "/board/like/" and method == "POST") and not (path == "/board/like/" and method == "DELETE") and not (path == "/board/like/{pk}/" and method == "GET") and not (path == "/board/like/{pk}/" and method == "POST"):
            filtered.append((path, path_regex, method, callback))
    return filtered