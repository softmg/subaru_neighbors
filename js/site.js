$('#neighbors-load-wrapper').on('loaded.neighbors', function(){
    alert(2323);
    $('.neighbors__username a').on('click', function(e) {
        e.preventDefault();
        localStorage.setItem('link', this.getAttribute('href'));
        return false;
    });
});