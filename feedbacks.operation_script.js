(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
  // implement resource here

  var records = [];
  var book = request.queryParams.book;
  var userId = request.queryParams.userId;

  var feedbackGR = new GlideRecord("x_965246_library_c_feedback");

  if (book) {
    feedbackGR.addQuery("book.name", book);
  }

  if (userId) {
    feedbackGR.addQuery("subscriber.sys_id", userId);
  }

  feedbackGR.query();
  while (feedbackGR.next()) {
    var record = {};
    record.subscriber = feedbackGR.getValue("subscriber");
    record.book = feedbackGR.getValue("book");
    record.mark = feedbackGR.getValue("mark");
    record.text = feedbackGR.getValue("text");
    record.date = feedbackGR.getValue("date");
    records.push(record);
  }

  if (records.length === 0) {
    response.setStatus(204);
    return;
  } else {
    response.setStatus(200);
    response.setContentType("application/json");
    response.setBody(records);
  }
})(request, response);
