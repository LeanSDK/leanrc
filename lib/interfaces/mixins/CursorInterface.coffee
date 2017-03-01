# интерфейс курсора как такового.
# конкретные курсоры это классы унаследованные от Proxy с использованием нужного платформозависимого миксина поддерживающего этот интерфейс например ArangoCursorMixin
# смысл в том, что наряду с Collection проксями (которые как бы интерфейсы к реально хранимым гдето данным) Cursor прокси должен предоставлять просто другой интерфейс по сути к тем же данным (апи этого интерфейса будет содержать методы next(), ... и др.) а в качестве входного параметра он должен принимать наверно инстанс QueryObject'а и нужен для того, чтобы работать с массивом выходящих данных от некоторого хранилища поштучно (как бы в потоке)

# возможно можно было бы сделать отдельный интерфейс и класс в паттернах с названием Iterator... - не знаю.
