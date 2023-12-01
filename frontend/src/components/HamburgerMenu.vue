<template>
    <div id="sidemenu">
        <button class="sidemenu__btn" v-on:click="navOpen=!navOpen" v-bind:class="{active:navOpen}">
                    <span class="top"></span>
                    <span class="mid"></span>
                    <span class="bottom"></span>
                </button>
        <transition name="translateX">
        <nav v-show="navOpen">
            <div class="sidemenu__wrapper">
            <ul class="sidemenu__list">
                <li class="sidemenu__item"><router-link to="/">Home</router-link></li>
                <li class="sidemenu__item"><router-link to="/search">Search</router-link></li>
                <li class="sidemenu__item"><a href="">Renter Tools</a></li>
                <li class="sidemenu__item"><a href="">Lessor Tools</a></li>
            </ul>
            </div>
        </nav>
        </transition>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                navOpen: false,
            };
        },
    };
</script>

<style lang="scss" scoped>
    #sidemenu {
        nav {
            width: 125px;
            // height: calc(100% - #{$headerHeight} - #{$footerHeight});
            background: #668d5e;
            position: fixed;
            top: 1vh;
            left: 0;
            z-index: 99;
            // box-shadow: 2px 0 3px$grey-6;
            // overflow-y: scroll;
        }

        .sidemenu {
            &__btn {
                display: block;
                width: 50px;
                height: 50px;
                background: transparent;
                border: none;
                position: relative;
                z-index: 100;
                appearance: none;
                cursor: pointer;
                outline: none;

                span {
                    display: block;
                    width: 20px;
                    height: 2px;
                    margin: auto;
                    background: white;
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    transition: all .4s ease;

                    &.top {
                        transform: translateY(-8px);
                    }

                    &.bottom {
                        transform: translateY(8px);
                    }
                }
                &.active{
                    .top {
                        transform: rotate(-45deg);
                    }
                    .mid{
                        transform: translateX(-20px) rotate(360deg);
                        opacity: 0;
                    }
                    .bottom {
                        transform: rotate(45deg);
                    }
                }

            }

            &__wrapper {
        padding-top: 60px;
        }

            &__list {
                padding-top: 50px;
        list-style:none;
        padding: 0;
        margin: 0;
            }

            &__item {
                a {
            text-decoration: none;
                    line-height: 1.2em;
                    font-size: 1.2em;
                    padding: .5em;
                    display: block;
                    color: white;
                    transition: .4s ease;

                    &:hover {
                        background: lightgrey;
                        color: dimgrey;
                    }
                }
            }
        }
    }

    .translateX-enter{
        transform:translateX(-200px);
        opacity: 0;
    }

    .translateX-enter-active,.translateX-leave-active{
        transform-origin: top left 0;
        transition:.2s ease;
    }

    .translateX-leave-to{
        transform: translateX(-200px);
        opacity: 0;
    }
</style>