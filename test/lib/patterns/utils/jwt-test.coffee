{ expect, assert } = require 'chai'
sinon = require 'sinon'
LeanRC = require.main.require 'lib'
{ co } = LeanRC::Utils

atob = (str) -> Buffer.from(str, 'base64').toString 'binary'
btoa = (str) ->
  buffer = if str instanceof Buffer then str else Buffer.from str.toString(), 'binary'
  buffer.toString 'base64'

b64_to_utf8 = (str) -> decodeURIComponent escape atob str

jwtRS256_private = '''
-----BEGIN RSA PRIVATE KEY-----
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
-----END RSA PRIVATE KEY-----
'''
jwtRS256_public = '''
-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAs8koUWg6NPRwwMHAUJAc
DmT0tuc5gM79is15SeuOk9qUArmFt4csgqk+sLPoLppnHwrbTfBkWFEllKta6t2B
KGns6MMmJ0ZpV35UNk7S0wGNoZ6FhRiAgzisb683pJARIW87OVjC60l4TFJ1mRJa
pwJfhSazvEqlojKWwHmBp01+1GbXBO5IFy2ZSfGxTtfvMcifyA/OVX4GO5702zkC
FrgQDmjte3gnbXE2J1Cz0bKkh7tInId3e7P1oepsG3OicSFa1c7Lmf+VxLxXN1Nk
P9TMDz4mHdJ1xTmMtdKcM7KRSqPzm+yV2gsjvV9OBs7cCZaxSfVkD/OUwHymFMFQ
qcyQaFKtyE12TbPtPF/dSOHLnccXQsoYtF9k8WqAjHoU8jBnWMS5Qe3MT17tsrW3
6xamASXJW226IduA5690RW6xDmMJw0YTSXFnmQduAclHpcv87Kflndr7/uAjOso2
SSv+wSx9ouBmLBCAVdTNPsSckEUSJjO6GvgMSU7Zj7UZ8vwmQZPtrQe9Oi1X5dt+
qG2jxly0HJdkHys31nnYI6GrvCONlxzOsDj6nK6Ib1cuoXcxB0gu5yeQfe1r1u3O
Se7KX/y/1js76QZJBnpeBkjfOh2KsZr0xM5nW2m2LJO/h1oFmp3wmxGWgh2acP3O
/A5C8iOgUl2yBXU1Fe2hr4sCAwEAAQ==
-----END PUBLIC KEY-----
'''
jwtES256_private = '''
-----BEGIN EC PRIVATE KEY-----
MHQCAQEEID32nTvwQj5fVbYUVZv7eUuogHQzczR76VBRWJS18sWOoAcGBSuBBAAK
oUQDQgAEUbsP1Bl5cOeOOAqKdt03wY0rvG3Ae2hnjrTu7gMvtV5q4uMIU1cs1WfX
qq8XWXEraM4P1cevzBxIXpfeijPwNA==
-----END EC PRIVATE KEY-----
'''
jwtES256_public = '''
-----BEGIN PUBLIC KEY-----
MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEUbsP1Bl5cOeOOAqKdt03wY0rvG3Ae2hn
jrTu7gMvtV5q4uMIU1cs1WfXqq8XWXEraM4P1cevzBxIXpfeijPwNA==
-----END PUBLIC KEY-----
'''


describe 'Utils.jwt*', ->
  describe 'Utils.jwtEncode', ->
    it 'should encode data with JWT (algorithm HS256)', ->
      co ->
        key = 'KEY'
        algorithm = 'HS256'
        message = 'TEST'
        token = yield LeanRC::Utils.jwtEncode key, message, algorithm
        data = b64_to_utf8 token.split('.')[1]
        assert.equal message, data
        message = test: 'test'
        token = yield LeanRC::Utils.jwtEncode key, message, algorithm
        { test: decoded } = JSON.parse b64_to_utf8 token.split('.')[1]
        assert.equal decoded, 'test'
        yield return
    it 'should encode data with JWT (algorithm HS384)', ->
      co ->
        key = 'KEY'
        algorithm = 'HS384'
        message = 'TEST'
        token = yield LeanRC::Utils.jwtEncode key, message, algorithm
        data = b64_to_utf8 token.split('.')[1]
        assert.equal message, data
        message = test: 'test'
        token = yield LeanRC::Utils.jwtEncode key, message, algorithm
        { test: decoded } = JSON.parse b64_to_utf8 token.split('.')[1]
        assert.equal decoded, 'test'
        yield return
    it 'should encode data with JWT (algorithm HS512)', ->
      co ->
        key = 'KEY'
        algorithm = 'HS512'
        message = 'TEST'
        token = yield LeanRC::Utils.jwtEncode key, message, algorithm
        data = b64_to_utf8 token.split('.')[1]
        assert.equal message, data
        message = test: 'test'
        token = yield LeanRC::Utils.jwtEncode key, message, algorithm
        { test: decoded } = JSON.parse b64_to_utf8 token.split('.')[1]
        assert.equal decoded, 'test'
        yield return
    it 'should encode data with JWT (algorithm RS256)', ->
      co ->
        key = jwtRS256_private
        algorithm = 'RS256'
        message = 'TEST'
        token = yield LeanRC::Utils.jwtEncode key, message, algorithm
        data = b64_to_utf8 token.split('.')[1]
        assert.equal message, data
        message = test: 'test'
        token = yield LeanRC::Utils.jwtEncode key, message, algorithm
        { test: decoded } = JSON.parse b64_to_utf8 token.split('.')[1]
        assert.equal decoded, 'test'
        yield return
    it 'should encode data with JWT (algorithm RS384)', ->
      co ->
        key = jwtRS256_private
        algorithm = 'RS384'
        message = 'TEST'
        token = yield LeanRC::Utils.jwtEncode key, message, algorithm
        data = b64_to_utf8 token.split('.')[1]
        assert.equal message, data
        message = test: 'test'
        token = yield LeanRC::Utils.jwtEncode key, message, algorithm
        { test: decoded } = JSON.parse b64_to_utf8 token.split('.')[1]
        assert.equal decoded, 'test'
        yield return
    it 'should encode data with JWT (algorithm RS512)', ->
      co ->
        key = jwtRS256_private
        algorithm = 'RS512'
        message = 'TEST'
        token = yield LeanRC::Utils.jwtEncode key, message, algorithm
        data = b64_to_utf8 token.split('.')[1]
        assert.equal message, data
        message = test: 'test'
        token = yield LeanRC::Utils.jwtEncode key, message, algorithm
        { test: decoded } = JSON.parse b64_to_utf8 token.split('.')[1]
        assert.equal decoded, 'test'
        yield return
    it 'should encode data with JWT (algorithm ES256)', ->
      co ->
        key = jwtES256_private
        algorithm = 'ES256'
        message = 'TEST'
        token = yield LeanRC::Utils.jwtEncode key, message, algorithm
        data = b64_to_utf8 token.split('.')[1]
        assert.equal message, data
        message = test: 'test'
        token = yield LeanRC::Utils.jwtEncode key, message, algorithm
        { test: decoded } = JSON.parse b64_to_utf8 token.split('.')[1]
        assert.equal decoded, 'test'
        yield return
    it 'should encode data with JWT (algorithm ES384)', ->
      co ->
        key = jwtES256_private
        algorithm = 'ES384'
        message = 'TEST'
        token = yield LeanRC::Utils.jwtEncode key, message, algorithm
        data = b64_to_utf8 token.split('.')[1]
        assert.equal message, data
        message = test: 'test'
        token = yield LeanRC::Utils.jwtEncode key, message, algorithm
        { test: decoded } = JSON.parse b64_to_utf8 token.split('.')[1]
        assert.equal decoded, 'test'
        yield return
    it 'should encode data with JWT (algorithm ES512)', ->
      co ->
        key = jwtES256_private
        algorithm = 'ES512'
        message = 'TEST'
        token = yield LeanRC::Utils.jwtEncode key, message, algorithm
        data = b64_to_utf8 token.split('.')[1]
        assert.equal message, data
        message = test: 'test'
        token = yield LeanRC::Utils.jwtEncode key, message, algorithm
        { test: decoded } = JSON.parse b64_to_utf8 token.split('.')[1]
        assert.equal decoded, 'test'
        yield return
  describe 'Utils.jwtDecode', ->
    it 'should decode token with JWT (algorithm HS256)', ->
      co ->
        key = 'KEY'
        algorithm = 'HS256'
        message = 'TEST'
        token = yield LeanRC::Utils.jwtEncode key, message, algorithm
        data = yield LeanRC::Utils.jwtDecode key, token, yes
        assert.equal data, message
        data = yield LeanRC::Utils.jwtDecode key, token, no
        assert.equal data, message
        message = test: 'test'
        token = yield LeanRC::Utils.jwtEncode key, message, algorithm
        { test: decoded } = yield LeanRC::Utils.jwtDecode key, token, yes
        assert.equal decoded, 'test'
        { test: decoded } = yield LeanRC::Utils.jwtDecode key, token, no
        assert.equal decoded, 'test'
        yield return
    it 'should decode token with JWT (algorithm HS384)', ->
      co ->
        key = 'KEY'
        algorithm = 'HS384'
        message = 'TEST'
        token = yield LeanRC::Utils.jwtEncode key, message, algorithm
        data = yield LeanRC::Utils.jwtDecode key, token, yes
        assert.equal data, message
        data = yield LeanRC::Utils.jwtDecode key, token, no
        assert.equal data, message
        message = test: 'test'
        token = yield LeanRC::Utils.jwtEncode key, message, algorithm
        { test: decoded } = yield LeanRC::Utils.jwtDecode key, token, yes
        assert.equal decoded, 'test'
        { test: decoded } = yield LeanRC::Utils.jwtDecode key, token, no
        assert.equal decoded, 'test'
        yield return
    it 'should decode token with JWT (algorithm HS512)', ->
      co ->
        key = 'KEY'
        algorithm = 'HS512'
        message = 'TEST'
        token = yield LeanRC::Utils.jwtEncode key, message, algorithm
        data = yield LeanRC::Utils.jwtDecode key, token, yes
        assert.equal data, message
        data = yield LeanRC::Utils.jwtDecode key, token, no
        assert.equal data, message
        message = test: 'test'
        token = yield LeanRC::Utils.jwtEncode key, message, algorithm
        { test: decoded } = yield LeanRC::Utils.jwtDecode key, token, yes
        assert.equal decoded, 'test'
        { test: decoded } = yield LeanRC::Utils.jwtDecode key, token, no
        assert.equal decoded, 'test'
        yield return
    it 'should decode token with JWT (algorithm RS256)', ->
      co ->
        privateKey = jwtRS256_private
        publicKey = jwtRS256_public
        algorithm = 'RS256'
        message = 'TEST'
        token = yield LeanRC::Utils.jwtEncode privateKey, message, algorithm
        data = yield LeanRC::Utils.jwtDecode publicKey, token, yes
        assert.equal data, message
        data = yield LeanRC::Utils.jwtDecode publicKey, token, no
        assert.equal data, message
        message = test: 'test'
        token = yield LeanRC::Utils.jwtEncode privateKey, message, algorithm
        { test: decoded } = yield LeanRC::Utils.jwtDecode publicKey, token, yes
        assert.equal decoded, 'test'
        { test: decoded } = yield LeanRC::Utils.jwtDecode publicKey, token, no
        assert.equal decoded, 'test'
        yield return
    it 'should decode token with JWT (algorithm RS384)', ->
      co ->
        privateKey = jwtRS256_private
        publicKey = jwtRS256_public
        algorithm = 'RS384'
        message = 'TEST'
        token = yield LeanRC::Utils.jwtEncode privateKey, message, algorithm
        data = yield LeanRC::Utils.jwtDecode publicKey, token, yes
        assert.equal data, message
        data = yield LeanRC::Utils.jwtDecode publicKey, token, no
        assert.equal data, message
        message = test: 'test'
        token = yield LeanRC::Utils.jwtEncode privateKey, message, algorithm
        { test: decoded } = yield LeanRC::Utils.jwtDecode publicKey, token, yes
        assert.equal decoded, 'test'
        { test: decoded } = yield LeanRC::Utils.jwtDecode publicKey, token, no
        assert.equal decoded, 'test'
        yield return
    it 'should decode token with JWT (algorithm RS512)', ->
      co ->
        privateKey = jwtRS256_private
        publicKey = jwtRS256_public
        algorithm = 'RS512'
        message = 'TEST'
        token = yield LeanRC::Utils.jwtEncode privateKey, message, algorithm
        data = yield LeanRC::Utils.jwtDecode publicKey, token, yes
        assert.equal data, message
        data = yield LeanRC::Utils.jwtDecode publicKey, token, no
        assert.equal data, message
        message = test: 'test'
        token = yield LeanRC::Utils.jwtEncode privateKey, message, algorithm
        { test: decoded } = yield LeanRC::Utils.jwtDecode publicKey, token, yes
        assert.equal decoded, 'test'
        { test: decoded } = yield LeanRC::Utils.jwtDecode publicKey, token, no
        assert.equal decoded, 'test'
        yield return
    it 'should decode token with JWT (algorithm ES256)', ->
      co ->
        privateKey = jwtES256_private
        publicKey = jwtES256_public
        algorithm = 'ES256'
        message = 'TEST'
        token = yield LeanRC::Utils.jwtEncode privateKey, message, algorithm
        data = yield LeanRC::Utils.jwtDecode publicKey, token, yes
        assert.equal data, message
        data = yield LeanRC::Utils.jwtDecode publicKey, token, no
        assert.equal data, message
        message = test: 'test'
        token = yield LeanRC::Utils.jwtEncode privateKey, message, algorithm
        { test: decoded } = yield LeanRC::Utils.jwtDecode publicKey, token, yes
        assert.equal decoded, 'test'
        { test: decoded } = yield LeanRC::Utils.jwtDecode publicKey, token, no
        assert.equal decoded, 'test'
        yield return
    it 'should decode token with JWT (algorithm ES384)', ->
      co ->
        privateKey = jwtES256_private
        publicKey = jwtES256_public
        algorithm = 'ES384'
        message = 'TEST'
        token = yield LeanRC::Utils.jwtEncode privateKey, message, algorithm
        data = yield LeanRC::Utils.jwtDecode publicKey, token, yes
        assert.equal data, message
        data = yield LeanRC::Utils.jwtDecode publicKey, token, no
        assert.equal data, message
        message = test: 'test'
        token = yield LeanRC::Utils.jwtEncode privateKey, message, algorithm
        { test: decoded } = yield LeanRC::Utils.jwtDecode publicKey, token, yes
        assert.equal decoded, 'test'
        { test: decoded } = yield LeanRC::Utils.jwtDecode publicKey, token, no
        assert.equal decoded, 'test'
        yield return
    it 'should decode token with JWT (algorithm ES512)', ->
      co ->
        privateKey = jwtES256_private
        publicKey = jwtES256_public
        algorithm = 'ES512'
        message = 'TEST'
        token = yield LeanRC::Utils.jwtEncode privateKey, message, algorithm
        data = yield LeanRC::Utils.jwtDecode publicKey, token, yes
        assert.equal data, message
        data = yield LeanRC::Utils.jwtDecode publicKey, token, no
        assert.equal data, message
        message = test: 'test'
        token = yield LeanRC::Utils.jwtEncode privateKey, message, algorithm
        { test: decoded } = yield LeanRC::Utils.jwtDecode publicKey, token, yes
        assert.equal decoded, 'test'
        { test: decoded } = yield LeanRC::Utils.jwtDecode publicKey, token, no
        assert.equal decoded, 'test'
        yield return
