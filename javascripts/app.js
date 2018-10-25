'use strict';

global.jQuery = require('jquery');
var $ = global.jQuery;

require('slick-carousel');
require('@fancyapps/fancybox');
require('malihu-custom-scrollbar-plugin')($);

$(document).ready(function () {

    anchorSlide();
    mainSlider();
    productTabs();
    productFilter();
    customScrollbar();

    if($('.js-product-carousel--tubes').length){
        productCarousel('.js-product-carousel--tubes');
        productCardImages('.js-product-carousel--tubes');
    }
    if($('.js-product-carousel--dispenser').length){
        productCarousel('.js-product-carousel--dispenser');
        productCardImages('.js-product-carousel--dispenser');
    }
    if($('.js-product-carousel--kids').length){
        productCarousel('.js-product-carousel--kids');
        productCardImages('.js-product-carousel--kids');
    }

    producerDescription();
    productCardTabs();
    purchaseTabs();
});

// Плавная прокрутка по странице, для ссылок с #
function anchorSlide(){

    var root = $('html, body');
    
    $(document).on('click', 'a[href^="#"]', function (e) {
        e.preventDefault();
        root.animate({
            scrollTop: $($.attr(this, 'href')).offset().top
        }, 1000);
    });

}

// Products tabs
function productTabs(){

    var tabsWrap = $('#products'),
        tabsItem = tabsWrap.find('.js-product-tabs .item'),
        tabsContent = tabsWrap.find('.js-product-tabs-content'),
        carousel = tabsWrap.find('.js-product-carousel');

    tabsItem.click(function(){
        var target = $(this).data('products');

        tabsItem.removeClass('active');
        tabsContent.removeClass('active');
        tabsContent.removeClass('popup');
        carousel.removeClass('active');
        $(this).addClass('active');
        $('#' + target + '').addClass('active');
    });

}

//Products filter
function productFilter() {

    var button = $('#products').find('.js-product-filter-button'),
        tabsWrap, productsWrap, products, currentProp;

    button.click(function(){
        button.removeClass('active');
        $(this).addClass('active');
        currentProp = $(this).data('filter');
        tabsWrap = $(this).closest('.tabs-content');
        productsWrap = tabsWrap.find('.products');
        products = productsWrap.find('.item');

        if(currentProp === 'general'){
            productsWrap.addClass('filtered');
            products.hide();
            products
                .filter(function(i) {
                    return $(this).data('filter') === "general";
                })
                .fadeIn(350);
        }
        else if(currentProp === 'special'){
            productsWrap.addClass('filtered');
            products.hide();
            products
                .filter(function(i) {
                    return $(this).data('filter') === "special";
                })
                .fadeIn(350);
        }
        else if(currentProp === 'fruit'){
            productsWrap.addClass('filtered');
            products.hide();
            products
                .filter(function(i) {
                    return $(this).data('filter') === "fruit";
                })
                .fadeIn(350);
        }
        else if(currentProp === 'flower'){
            productsWrap.addClass('filtered');
            products.hide();
            products
                .filter(function(i) {
                    return $(this).data('filter') === "flower";
                })
                .fadeIn(350);
        }
        else {
            productsWrap.removeClass('filtered');
            products.fadeIn(350);
        }
    });

}

//Product cards carousel
function productCarousel(carousel) {

    var carouselWrap = $(carousel),
        cards = carouselWrap.find('.js-product-cards'),
        nav = carouselWrap.find('.js-product-nav'),
        root = $('html, body');

    cards.slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        draggable: false
    });

    nav.slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        asNavFor: cards,
        focusOnSelect: true,
        responsive: [
            {
                breakpoint: 1365,
                settings: {
                    slidesToShow: 4
                }
            },
            {
                breakpoint: 1023,
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 2
                }
            }
        ]
    });

    $('.js-product-popup-close').click(function() {
        $('.js-product-carousel').removeClass('active');
        $('.js-product-tabs-content').removeClass('popup').removeAttr('style');
    });

    $('.js-product-item').click(function() {
        var wrap = $(this).closest('.js-product-tabs-content'),
            products = wrap.find('.js-products .item'),
            productCarousel = wrap.find('.js-product-carousel'),
            productCardHeight = productCarousel.find('.slick-active').height(),
            currentHeight = productCardHeight + 350,
            index = products.index(this);

        root.animate({
            scrollTop: wrap.offset().top
        }, 500);
        productCarousel.addClass('active');
        wrap.height(currentHeight);
        wrap.addClass('popup');
        wrap.find('.js-product-cards').slick('slickGoTo', index);
        wrap.find('.js-product-nav').slick('slickGoTo', index);
    });

}

//Product card images
function productCardImages(carousel){

    var carouselWrap = $(carousel),
        cardImagesItem = carouselWrap.find('.js-product-card-images .item'),
        cardImagesNav = carouselWrap.find('.js-product-card-images-nav .item');

    cardImagesNav.click(function() {
        var wrap = $(this).closest('.image'),
            cardImagesNav = $(this).closest('.js-product-card-images-nav'),
            indexNav = cardImagesNav.find('.item').index(this),
            cardImages = wrap.find('.js-product-card-images').find('.item');

        $(this).siblings().removeClass('active');
        $(this).addClass('active');

        cardImages.each(function(){
            var indexImage = cardImages.index(this);

            if(indexNav === indexImage){
                $(this).siblings().removeClass('active');
                $(this).addClass('active');
            }
        });

    });

}

//Product card tabs
function productCardTabs(){

    var tabsWrap = $('.js-product-card-description'),
        tabsItem = tabsWrap.find('.js-description-tabs .item');

    tabsItem.click(function(){
        var target = $(this).data('description'),
            wrap = $(this).closest('.js-product-card-description'),
            tabsContent = wrap.find('.js-description-tabs-content');

        $(this).siblings('.item').removeClass('active');
        tabsContent.removeClass('active');
        $(this).addClass('active');
        tabsContent.each(function () {
            if($(this).data('descriptionContent') === target) {
                $(this).addClass('active');
            }
        });
    });

}

//Main slider
function mainSlider() {
    var slider = $('.js-main-slider'),
        sliderWrap = slider.closest('.main-slider__wrap');

    slider.on('init', function(event, slick){
        sliderWrap.removeClass('init');
    });
    slider.slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        dots: true,
        fade: true,
        responsive: [
            {
                breakpoint: 767,
                settings: {
                    arrows: false
                }
            }
        ]
    });

    $('.js-main-slide-link').click(function(){
        activateTab($(this));
    });
}

function producerDescription() {
    $('.js-producer-button').click(function(){
        $(this).toggleClass('active');
        $('.js-producer-description').toggleClass('active');
    });
}

//Custom scrollbar
function customScrollbar() {
    $(".js-custom-scroll").mCustomScrollbar({
        theme:"dark"
    });
}

// Purchase tabs
function purchaseTabs(){

    var tabsWrap = $('.js-purchase-tabs__wrap'),
        tabsItem = tabsWrap.find('.tab'),
        tabsContent = tabsWrap.find('.tabs__content');

    tabsItem.click(function(){
        var target = $(this).data('tab');

        tabsItem.removeClass('active');
        tabsContent.removeClass('active').hide();
        $(this).addClass('active');
        tabsContent.each(function () {
            if($(this).data('tabContent') === target) {
                $(this).fadeIn(350);
            }
        });
    });
}

// Activating tab by click on main slider
function activateTab(item){

    var _this = item,
        target = item.data('tabItem'),
        filter = item.data('tabFilter'),
        tabsWrap = $('.js-product-tabs'),
        tabsItems = tabsWrap.find('.item'),
        tabsContent = $('.js-product-tabs-content'),
        root = $('body, html'),
        products = $('#products');

    tabsItems.removeClass('active');
    tabsContent.removeClass('active');
    tabsContent.removeClass('popup');

    tabsItems.each(function () {
        if($(this).data('products') === target) {
            $(this).addClass('active');
        }
    });

    tabsContent.each(function () {
        if($(this).attr('id') === target) {
            $(this).addClass('active');

            if(filter !== undefined) {
                var productsWrap = $(this).find('.products'),
                    products = productsWrap.find('.item'),
                    button = $('#products').find('.js-product-filter-button');

                button.removeClass('active');
                button.each(function () {
                    if($(this).data('filter') === filter) {
                        $(this).addClass('active');
                    }
                });
                productsWrap.addClass('filtered');
                products.hide();
                products.filter(function(i) {
                    return $(this).data('filter') === filter;
                })
                    .fadeIn(350);
            }
        }
    });

    root.animate({
        scrollTop: products.offset().top
    }, 500);
}