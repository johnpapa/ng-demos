beforeEach(function () {
    stubToastr();

    function stubToastr(){
        // stub toastr to just go to console
        spyOn(toastr, 'info').and.callFake(fakeToast);
        spyOn(toastr, 'error').and.callFake(fakeToast);
        spyOn(toastr, 'warning').and.callFake(fakeToast);
        spyOn(toastr, 'success').and.callFake(fakeToast);

        function fakeToast(msg){
            console.log(msg);
        }
    }
});
