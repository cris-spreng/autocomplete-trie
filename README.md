# Typeahead API

## Description

Typeahead or autocomplete is a common feature that people come across on websites. For example, when you are searching on Google, you will notice a word populates before you finish typing.

For example, if the data provided is `{ "John": 21, "James": 43, "Joanna": 53, "Jazmin": 3 }` and the system receives a request with the `jo` prefix, then it will return the names *Joanna* and *John*, in that order.

## Environment

- `PORT`: the port the application must listen on.
- `SUGGESTION_NUMBER`: the max amount of results the application should return.
- `HOST`: the host to where the application will be deployed to. 

The origin of the data is in the file `names.json`.
No persistency is applied to any of the data.

## Endpoints

The application uses JSON as the content type for both, requests and responses. It supports the following two endpoints:

### `GET /typeahead/{prefix}`

Receives a prefix in the path and returns an array of objects each one having the `name` and `times` (popularity) properties. The result contains all the names that start with the given `prefix` up to a maximum of `SUGGESTION_NUMBER` names, sorted by highest popularity (`times`) descending and name in alphabetical order if they have equal popularity, always leaving the exact match (a name that is exactly the received `prefix`) at the beginning if there is one.

If the `prefix` segment of the path is not given or it's empty (`/typeahead` or `/typeahead/`), it returns the `SUGGESTION_NUMBER` names with the highest popularity and name ascending in case of equal popularity.

This endpoint considers the `prefix` in a case insensitive way (so you get the same results for `JA`, `Ja`, `jA` or `ja`) but the responses always return the names capitalized.

#### Examples

```bash
$ curl -X GET http://{HOST}:{PORT}/typeahead/ja

[{"name":"Janetta","times":973},{"name":"Janel","times":955},{"name":"Jazmin","times":951},{"name":"Janette","times":947},{"name":"Janet","times":936},{"name":"Janeva","times":929},{"name":"Janella","times":916},{"name":"Janeczka","times":915},{"name":"Jaquelin","times":889},{"name":"Janaya","times":878}]
```

```bash
$ curl -X GET http://{HOST}:{PORT}/typeahead/jan

[{"name":"Jan","times":296},{"name":"Janetta","times":973},{"name":"Janel","times":955},{"name":"Janette","times":947},{"name":"Janet","times":936},{"name":"Janeva","times":929},{"name":"Janella","times":916},{"name":"Janeczka","times":915},{"name":"Janaya","times":878},{"name":"Janine","times":858}]
```

### `POST /typeahead`

Receives a JSON object with a name as the request body (example: `{ "name": "Joanna" }`), increases the popularity for that name in 1, and returns a `201` status code with an object with `name` and `times` properties considering the new state.

If the given name does not exist in the initial data pool then this endpoint returns a 400 HTTP error and an object `{"message": "Not Found"}`(no new names are added).

This endpoint is also case insensitive, so request for `{ "name": "JOANNA" }`, `{ "name": "Joanna" }` and `{ "name": "JoAnNa" }` all work to increase the popularity value for *Joanna*, but the returned name in this request is always capitalized.

#### Example

```bash
$ curl -X POST -H "Content-Type: application/json" -d '{"name": "Joanna"}' http://{HOST}:{PORT}/typeahead

{"name":"Joanna","times":441}
```

```bash
$ curl -X POST -H "Content-Type: application/json" -d '{"name": "Pablov"}' http://{HOST}:{PORT}/typeahead

{"message":"Not Found"}
```

## Performance

For better performance the data is stored and delivered using a **prefix tree** (also known as Trie).

A reasonably good implementation of a prefix tree in this context can be more performant than an SQL query in a relational database. This is yet to be tested in anothe project.

## Automated tests

Automated tests were done using Jest and node-fetch.
