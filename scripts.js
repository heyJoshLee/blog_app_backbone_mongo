// Backbone Model

var Blog = Backbone.Model.extend({
  defualts: {
    author: "",
    title: "",
    url: ""
  }
})


// Backbone collection

var Blogs = Backbone.Collection.extend({

});


var blog1 = new Blog({
  author: "josh",
  title: "josh\s blog",
  url: "google.com"
});

var blog2 = new Blog({
  author: "jos2",
  title: "josh\s blo2",
  url: "google.co2"
});

var blogs = new Blogs([blog1, blog2]);

// backbone view

var BlogView = Backbone.View.extend({
  model: new Blog(),
  tagName: "tr",

  initialize: function() {
    this.template = _.template($(".blogs-list-template").html());
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }

});

var BlogsView = Backbone.View.extend({
  model: blogs,
  el: $(".blogs-list"),

  initialize: function() {
    this.model.on("add", this.render, this);
  },

  render: function() {
    var self = this;
    _.each(this.model.toArray(), function(blog) {
      self.$el.append((new BlogView({model: blog})).render().$el);
    });
    return this;
  }
});

var blogsView = new BlogsView();

$(document).ready(function() {
  $(".add-blog").on("click", function() {
    var blog = new Blog({
      author: $(".author-input").val(),
      title: $(".title-input").val(),
      url: $(".url-input").val()
    });
    console.log(blog.toJSON());
    blogs.add(blog);
  });
})