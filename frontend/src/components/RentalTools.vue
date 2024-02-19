<template>
    <div class="rental-tools-section double-color-background">
        <h2>Your one stop shop for everything renting.</h2>
        
        <!-- Renter Tools -->
        <div class="content">
            <div class="tool-section" ref="toolSection">
                <div class="tool-content">
                    <h3>(Coming Soon!)</h3>
                    <h3>For Renters</h3>
                    <p>Access tools and resources specially designed for renters to cut out the clutter with renting.</p>
                    <a class="tools-btn" href="/">Renter Tools</a>
                </div>
                <img src="../assets/renterstockimage.jpg" alt="Renter Image" class="tool-image">
            </div>

            <!-- Lessor Tools -->
            <div class="tool-section" ref="toolSection">
                <img src="../assets/lessorstockimage2.jpeg" alt="Lessor Image" class="tool-image">
                <div class="tool-content">
                    <h3>(Also Coming Soon!)</h3>
                    <h3>For Managers</h3>
                    <p>Manage properties, input information, and streamline your leasing process.</p>
                    <a class="tools-btn" href="/">Manage Rentals</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../assets/css-animations/animation-sheet.css';

gsap.registerPlugin(ScrollTrigger);

export default {
    name: 'RentalToolsSection',
    mounted() {
        gsap.utils.toArray('toolSection').forEach((section, index) => {
            gsap.from(section, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom-=100',
                },
                x: -200,
                autoAlpha: 0,
                delay: index * 0.5,
                duration: 1,
            });
        });
    },
};
</script>

<style scoped>
    h2 {
        color: #ffffff;
        font-size: 40px;
        margin-bottom: 5vh;
    }

    h3 {
        margin-bottom: 20px;
        font-size: 2em;
    }

    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 75%;
        height: 80vh;
    }

    .rental-tools-section {
        background-color: black;
        display: flex;
        flex-direction: column;
        text-align: center;
        padding: 40px;
        min-height: 70vh;
        justify-content: center;
        align-items: center;
    }

    .tool-section {
        display: flex;
        align-items: stretch;
        justify-content: space-between;
        margin: 20px 20px;
        height: 35%;
        width: 100%;
    }

    .tool-image, .tool-content {
        flex: 1;
        object-fit: cover;
    }

    .tool-image {
        object-fit: cover;
    }

    .tool-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: #cccccc;
        padding: 20px;
    }

    .tools-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: auto;
        padding: 5px;
        height: 5vh;
        margin-top: 10px;
        text-decoration: none;
        color: #252525;
        background-color: #afc6d2;
        border-radius: 20px;
        border: 2px solid black;
        transition: transform .2s ease-in-out;
    }
    .tools-btn:hover {
        transform: scale(1.1);
    }


    @media only screen and (min-width: 768px) {
        .content {
            width: 85%;
        }
    }
    @media only screen and (min-width: 1120px) {
        .content {
            width: 70%;
        }
    }

    /* Mobile */
    @media only screen and (max-width: 768px) {
        h2 {
            font-size: 30px;
        }
        h3 {
            font-size: 20px;
        }
        .content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        .tool-section {
            width: 90vw;
        }
        .tool-image {
            width: 50%;
            height: 100%;
        }
        .tool-content {
            font-size: 0.9em;
        }
        .tools-btn {
            width: 75px;
        }
    }

    @media only screen and (max-width: 578px) {
        h3 {
            font-size: 16px;
        }
        .tools-btn {
            width: 50px;
            font-size: 10px;
        }
        p {
            font-size: 12px;
        }
    }
</style>
