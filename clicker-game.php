<?php
/*
Plugin Name: Clicker Game with Speed and Income Upgrades
Description: A clicker game where you can increase time speed and earn money with upgrades.
Version: 0.4
Author: Daniil Karataev
*/

function clicker_game_enqueue_scripts() {
    $image_url = plugins_url('img/814476.webp', __FILE__);

    wp_enqueue_style( 'reset', plugins_url('/css/reset.css', __FILE__), array(), get_file_version('/css/reset.css') );
    wp_enqueue_style( 'custom-fonts', plugins_url('/css/fonts.css', __FILE__), array(), get_file_version('/css/fonts.css') );
    wp_enqueue_style( 'clicker-game-style', plugins_url('/style.css', __FILE__));


    wp_enqueue_script('clicker-game-script', plugins_url('/script.js', __FILE__), array(), null, true);

    wp_localize_script('clicker-game-script', 'clickerGameData', array(
        'imageUrl' => esc_url($image_url)
    ));
}

add_action('wp_enqueue_scripts', 'clicker_game_enqueue_scripts');

function clicker_game_shortcode() {
    $image_url = plugins_url('img/earth-globe-icon-white-background.png', __FILE__); 

    ob_start(); ?>
        <style>
            :root {
                --planet-img: url("<?php echo esc_url($image_url); ?>");
            }
        </style>
        <div class="body-game">
            <div class="game-menu">
                <div id="timer">00:00:00</div>
                <div class="income">
                    <div id="income">Доход: 0</div>
                    <div id="balance">Баланс: 0</div>
                </div>
                <div class="bth-income">
                    <div id="bth-income">Доход bth: 0</div>
                    <div id="bth-balance">Баланс bth: 0</div>
                </div>
            </div>
            <div id="upgrade-popup">
                <div class="tabs">
                    <button class="btn tab-button" data-tab="income-upgrades">Улучшение дохода</button>
                    <button class="btn tab-button" data-tab="speed-upgrades">Ускорение времени</button>
                    <button class="btn tab-button" data-tab="bth-upgrades">Улучшение добычи bth</button>
                    <button class="btn tab-button" data-tab="bonus-upgrades">Бусты</button>
                </div>
                <div class="upgrade-section" id="income-upgrades" style="display: none;">
                    <h3 class="upgrades-income">Улучшение дохода</h3>
                    <button class="btn" id="upgrade-income"><p>Доход с кликов</p> <p class="price">$10</p></button>
                    <button class="btn" id="upgrade-passive-income"><p>Улучшение пассива</p> <p class="price">$20</p></button>
                </div>
                <div class="upgrade-section" id="speed-upgrades" style="display: none;">
                    <h3 class="upgrades-income">Ускорение времени</h3>
                    <button class="btn speed-btn" data-speed="2" data-cost="2"><p>+2x скорость</p> <p class="price">$2</p></button>
                    <button class="btn speed-btn" data-speed="5" data-cost="9"><p>+5x скорость</p> <p class="price">$9</p></button>
                    <button class="btn speed-btn" data-speed="10" data-cost="17"><p>+10x скорость</p> <p class="price">$17</p></button>
                </div>
                <div class="upgrade-section" id="bth-upgrades" style="display: none;">
                    <h3 class="upgrades-bth">Добыча bth</h3>
                    <button class="btn" id="upgrade-bth"><p>Начать добычу bth (раз в 5 минут)</p> <p class="price">$1000</p></button>
                </div>
                <div class="upgrade-section" id="bonus-upgrades" style="display: none;">
                    <h3 class="upgrades-bth">Бусты</h3>
                    <button class="btn" id="activate-bonus">Активировать бонус увскорение времени на 50x на 5 мин <p class="price bth">bth 1</p></button>
                </div>
            </div>
            <div id="info-upgrades">
                <h3>Информация</h3>
                <div id="countdown-365"></div>
                <p id="speed-info">Множитель скорости: <span id="base-multiplier">x1</span></p>
                <div id="bonus-list"></div>
            </div>
            <button id="earn">Заработать 1 доллар</button>
            <div class="planet" id="planet">
                <div></div>
            </div>
            <div id="popup-message" class="popup">
                <div class="popup-content">
                    <p id="popup-text"></p>
                    <button id="popup-close">Закрыть</button>
                </div>
            </div>
            <div class="background-stars"></div>
        </div>
    <?php return ob_get_clean();
}

add_shortcode('clicker_game', 'clicker_game_shortcode');
?>
