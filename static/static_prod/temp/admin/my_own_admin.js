$(document).ready(function() {
    $("#id_qwests_qty_total").prop("readonly",true);
    function getvalues(){
        var j = parseInt("0")
        var pp = $('#id_qwests_qty_total');
        var pps = $("input[name*='quest_capacity_item_list_total']");
        pp.val(0);
        for (var i = 0; i <pps.length; i++) {
            var inp=pps[i];
                j += parseInt(inp.value);
        };
        pp.val(j);
    }
    $(document).on('change', "select[name*='quest_category_type']", function(e) {
        e.preventDefault();
        var parent_v = $(this).parents("tr[id*='pollitemlist_set-']")
        var parent_var = parent_v.children('td.field-quest_capacity_item_list_total').children('input[name*="quest_capacity_item_list_total"]');
        var hidden_field = parent_v.children('td.field-quest_category_title').children('input[name*="quest_category_title"]');
        // var hidden_field = parent_v.
        parent_var.attr("max",this.value).val(this.value);
        var select_key = $(this).find('option:selected').text();
        hidden_field.val(select_key);
        // hh = this;
        // console.log(this);
        // console.log(tt);
        getvalues();
    });
    $(document).on('change', 'input[name*="quest_capacity_item_list_total"]', function(e) {
        e.preventDefault();
        getvalues();
    });
    $(document).on('click', 'a.inline-deletelink', function(e) {
        e.preventDefault();
        getvalues();
    });
});
