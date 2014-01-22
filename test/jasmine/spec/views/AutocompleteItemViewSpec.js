define(['views/autocompleteItemView', 'text!tpl/AutocompleteItemView.html'], function(AutocompleteItem) {

    return describe('View :: AutocompleteItemView', function() {


        describe('#initialize', function() {

            beforeEach(function() {
                this.autocompleteView = new AutocompleteItem({txt: "newtext"});
            });

            afterEach(function() {
                this.autocompleteView.remove();
            });

            it('should properly initialize the view', function() {
                this.autocompleteView.initialize();
                expect(this.autocompleteView.txt).toEqual("newtext");
            });
        });


        describe('#render', function() {

            beforeEach(function() {
                this.autocompleteView = new AutocompleteItem({txt: "newtext", name: "myname"});
            });

            afterEach(function() {
                this.autocompleteView.remove();
            });

            it('checks that view is rendered properly', function() {
                $('#musicapp').html(this.autocompleteView.render().el);
                //expect($('#musicapp')).toHaveText('Blank');
                expect($('#newtext').attr('class')).toEqual('delete-autocomplete');
                expect($('#newtext').attr('name')).toEqual('myname');
            });
        });



    });

});
