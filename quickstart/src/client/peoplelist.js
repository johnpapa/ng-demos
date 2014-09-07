$(function(){

    var people = [
        {first: 'John', last: 'Papa'},
        {first: 'Bob', last: 'Fields'},
        {first: 'Brian', last: 'Clark'},
        {first: 'Greg', last: 'Stewart'}
    ];
    var peopleFiltered = people;

    loadPeopleList();

    function loadPeopleList(){
        var list = peopleFiltered;
        for(var i=0; i < list.length; i++){
            var $newRow = $('<tr></tr>');
            $newRow.append('<td>' + list[i].first + '</td>');
            $newRow.append('<td>' + list[i].last + '</td>');
            $('#peopleList > tbody').append($newRow);
        }
    }

    function clearPeopleList(){
        peopleFiltered = [];
        $('#peopleList tr').has('td').remove();
    }

    $('#addRow').click(function(){
        var $newRow = $('<tr></tr>');
        $newRow.append('<td><input type="text"/></td>');
        $newRow.append('<td><input type="text"/></td>');
        $('#peopleList > tbody').append($newRow);
    });

    function contains(text, matcher){
        return text.toLowerCase().indexOf(matcher.toLowerCase()) !== -1;
    }

    $('#personFilter').keyup(function(event){
        clearPeopleList();
        var value = $(this).val();
        for(var i=0; i < people.length; i++){
            if(contains(people[i].first, value) || contains(people[i].last, value)){
                peopleFiltered.push(people[i]);
            }
        }
        loadPeopleList();
    });


});