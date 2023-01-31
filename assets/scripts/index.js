$(document).ready(function () {
    // NOTE tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();

    // NOTE carousel pagination control       
    var totalItems = $('.item').length;
    var currentIndex = $('div.active').index() + 1;
    $('.num').html('' + currentIndex + '/' + totalItems + '');
    $('#myCarousel').on('slid.bs.carousel', function () {
        currentIndex = $('div.active').index() + 1;
        $('.num').html('' + currentIndex + '/' + totalItems + '');
    });

    $('#myCarousel').on('slid.bs.carousel', function () {
        currentIndex = $('div.active').index() + 1;
        $('.num').html('' + currentIndex + '/' + totalItems + '');
    });
    // NOTE carousel next_screen control function     

    $("#next_screen").on("click", function () {
        $("#prev_screen").removeClass("prevent_click");
        if (currentIndex + 1 == totalItems) {
            $("#next_screen").addClass("prevent_click");
        }
    })
    // NOTE carousel prev_screen control function     

    $("#prev_screen").on("click", function () {
        $("#next_screen").removeClass("prevent_click");
        if (currentIndex - 1 == 1) {
            $("#prev_screen").addClass("prevent_click");
        }
    })

    // NOTE  reload   function     
    $('.reload_btn').on('click', function () {
        playSound('./assets/audio/end.wav');
        $("#myCarousel").carousel(0);
        $("#next_screen").removeClass("prevent_click");
        $("#prev_screen").addClass("prevent_click");
    });

    $('.hintClose').on('click', function () {
        stopAudio()
        document.getElementById("hint").style.display = "none";
    });

    $('.carousel-control-next').on('click', function () {
        playSound('./assets/audio/flip.wav')
    });

    $('.carousel-control-prev').on('click', function () {
        playSound('./assets/audio/flip.wav')
    });
});

// NOTE playSound fun
function playSound(url) {
    var ourAudio = document.createElement('audio');
    ourAudio.style.display = "none";
    ourAudio.src = url;
    ourAudio.autoplay = true;
    ourAudio.onended = function () {
        this.remove();
    };
    document.body.appendChild(ourAudio);
}
////////////////////////////////////////////////////////////////