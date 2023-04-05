(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
  // implement resource here
  var requestBody = request.body.data;
  var book = requestBody.book;
  var mark = requestBody.mark;
  var text = requestBody.text;
  var userId = requestBody.userId;

  if (!book || !mark || !text || !userId) {
    response.setStatus(400);
    response.setBody({
      errorMessage: "Not all required parameters were provided",
    });
    return;
  }

  var bookGR = new GlideRecord("x_965246_library_c_bookshelf");
  if (!bookGR.get(book)) {
    response.setStatus(400);
    response.setBody({
      errorMessage: "Book not found",
    });
    return;
  }

  var groupMemberGR = new GlideRecord("sys_user_grmember");
  groupMemberGR.addQuery("user", userId);
  groupMemberGR.addQuery("group.name", "Subscribers");
  groupMemberGR.query();
  if (!groupMemberGR.next()) {
    response.setStatus(400);
    response.setBody({
      message: "Subscriber not found",
    });
    return;
  }

  var feedbackGR = new GlideRecord("x_965246_library_c_feedback");
  feedbackGR.initialize();
  feedbackGR.setValue("book", bookGR.getUniqueValue());
  feedbackGR.setValue("mark", mark);
  feedbackGR.setValue("text", text);
  feedbackGR.setValue("date", new Date().getDate());
  feedbackGR.setValue("subscriber", groupMemberGR.user);
  feedbackGR.insert();

  response.setStatus(201);
  response.setContentType("application/json");
  response.setBody({
    message: feedbackGR.getDisplayValue(),
    feedbackId: feedbackGR.getUniqueValue(),
  });
})(request, response);
