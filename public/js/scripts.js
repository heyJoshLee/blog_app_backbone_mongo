Backbone.Model.prototype.idAttribute = "_id";
// Backbone Model

var Blog = Backbone.Model.extend({
  defualts: {
    author: "",
    title: "",
    url: ""
  }
});

// Backbone collection

var Blogs = Backbone.Collection.extend({
  url: "http://localhost:3000/api/blogs"
});

var blogs = new Blogs();

// backbone view

var BlogView = Backbone.View.extend({
  model: new Blog(),
  tagName: "tr",

  initialize: function() {
    this.template = _.template($(".blogs-list-template").html());
  },

  events: {
    "click .edit-blog": "edit",
    "click .update-blog": "update",
    "click .cancel-blog": "cancel",
    "click .delete-blog": "delete"
  },

  edit: function() {
    this.$(".edit-blog").hide();
    this.$(".delete-blog").hide();
    this.$(".update-blog").show();
    this.$(".cancel-blog").show();

    var author = this.$(".author").html(),
        title = this.$(".title").html(),
        url = this.$(".url").html();

    this.$(".author").html("<input type='text' class='form-control author-update' value='" + author + "'>");
    this.$(".title").html("<input type='text' class='form-control title-update' value='" + title + "'>");
    this.$(".url").html("<input type='text' class='form-control url-update' value='" + url + "'>");
  },

  update: function() {
    this.model.set({
      "author": $(".author-update").val(),
      "title": $(".title-update").val(),
      "url": $(".url-update").val()
    });

    this.model.save(null, {
      
      success: function(response) {
        console.log("Successfully updated blog with id:" + response.toJSON().id);
      },

      error: function(response) {
        console.log("Failed to update blog")
      }
    });
  },

  cancel: function() {
    blogsView.render();
  },

  delete: function() {
    this.model.destroy({
      success: function(response) {
        console.log("Successfully DELETED log with _id:" + response.toJSON()._id);
      },
      error: function() {
        console.log("Failed to DELETE blog")
      }
    });
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
    this.model.on("change", this.render, this);
    this.model.on("remove", this.render, this);
    this.model.fetch({
      success: function(response) {
        _.each(response.toJSON, function(item){
          console.log("successfully GOT blog with _id: ");
        });
      },
      error: function() {
        console.log("Failed to get blogs");
      }
    })
  },


  render: function() {
    var self = this;
    this.$el.html("");
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
    $("[class*='input'").val("");
    blogs.add(blog);

    blog.save(null, {
      success: function(res) {
        console.log("Successfully saved blog with id: " + res.toJSON()._id)
      },

      error: function() {
        console.log("Failed to save blog");
      }
    });
  });
});