var itemList = new Carbon("recipes");
var itemHistory = new Carbon("recipes-history");
refresh_list();

items=itemList.get_all();
items.forEach(function(item) {
	history_items=itemHistory.get_all();
   	history_items=history_items.query("title", "==", item.title);
   	history_count = history_items.length;
   	item.history =  history_count;
 });
    

// EDIT .subitem-center .title
$(document).on('click', ".subitem-center", function() {
	
	id = $(this).closest(".item").find(".item_id").text();
	edit_item = itemList.get_item(id);

	$("#edit").find(".menu-title").html("Edit: "+edit_item.title);
    
    for (var key in edit_item) {
        $('#edit-item-form [name="'+key+'"]').val(edit_item[key]);
    }
    
    history_items=itemHistory.get_all();
    history_items=history_items.query("title", "==", edit_item.title);
    history_items.sort(
        firstBy(function (v1, v2) { return v2.finish_date<v1.finish_date ? -1 : v2.finish_date>v1.finish_date ? 1 : 0;}) 
    );
    
    $("#history_items").empty();    
      history_items.forEach(function(item) {
		var template = $('#history_items_template').html();
		var html = Mustache.to_html(template, item);
		$("#history_items").append(html);
	});
		
    $(".page").hide();
    $("#edit").show();
	
	$('.more').hide();
	$('.more-button').show();
    
    window.scrollTo(0, 0);
});


// #new-button
$(document).on('click', "#new-button", function() {
	
	$('#new-item-form input[name="title"]').val(""); 
    //$('#new-item-form input[name="postpone"]').val(undefined); 
    $('#new-item-form input[name="tags"]').val(""); 
    $('#new-item-form textarea[name="ingrediens"]').val(""); 
    $('#new-item-form textarea[name="instructions"]').val(""); 
	
	$(".page").hide();
	$("#new").show();
});


//Sort by
$(document).on('change', "#sortby", function() {
 	refresh_list();
});

// .save-button
$(document).on('click', ".save-button", function() {
    
    itemList.edit_from_form("#edit-item-form");
    refresh_list();
    
    //var scroll_offset = $(".item_id:contains('"+id+"')").parent().offset().top-100;
    //window.scrollTo(0, scroll_offset);
});


// .add-button
$(document).on('click', ".add-button", function() {
    itemList.add_from_form("#new-item-form");
    refresh_list();

});

// .more-button
$(document).on('click', ".more-button", function() {
	$('.more').show();
	$('.more-button').hide();
});
 
 
// .cancel-button
$(document).on('click', ".cancel-button", function() {
    
    itemList.edit_from_form("#edit-itemf-form");
    refresh_list();
    
    //var scroll_offset = $(".item_id:contains('"+id+"')").parent().offset().top-100;
    //window.scrollTo(0, scroll_offset);
});

// .delete-button
$(document).on('click', ".delete-button", function() {
	id = $("#edit-item-form .item-id").val();
	console.log(id);
    if (confirm('Delete "'+itemList.get_item(id).title+'"?')==true) {
    itemList.remove_item(id);
    refresh_list();
    }
});


//refresh list
function refresh_list(){
  
    var query = $("#search").val();
    
    open_items=itemList.get_all();
    

    
    //sortera fltered items
    open_items.sort(
        firstBy(function (v1, v2) { return v1.update_date >v2.update_date ? -1 : v1.update_date <v2.update_date  ? 1 : 0;}) 
	);
	
  	//mustache output open
   	$("#open_items").empty();    
  	open_items.forEach(function(item) {
		var template = $('#open_items_template').html();
		var html = Mustache.to_html(template, item);
		$("#open_items").append(html);
	});
	
	
  	//om inga items hittas
	if (open_items.length == 0 && finished_items.length == 0) $("#open_items").append("<div class='empty'>No items here</div>");
    
    $(".page").hide();
	$("#search").show();
}

// gear button (preferences)
$(document).on('click', ".pref-button", function(){  
        $(".page").hide();
		$("#menu").show();
});

// #import-button
$(document).on('click', "#import-button", function() {
    if (confirm('All current data will be deleted?')==true) {
        window.localStorage.setItem(itemList.storageKey, $('#import').val());
       	refresh_list();
       	refresh_list();
    }
});
 
// #export all-button
$(document).on('click', "#export-button", function() {
    var items = itemList.get_all();
    var items_string = JSON.stringify(items);
    $("#export").html(items_string);
    $(".page").hide();
    $("#export").show();
});


// #clear history
$(document).on('click', "#clear-history-button", function() {
 	window.localStorage.setItem(itemHistory.storageKey, "[]");
});



