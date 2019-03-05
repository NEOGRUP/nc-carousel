import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import './nc-carousel-items.js';

// Extend Polymer.Element base class
class NcCarousel extends PolymerElement {
  static get template() {
    return html`
      <style>
        nc-carousel-items {
          width: 100%;
        }
      

        nc-carousel-items::after {
          display: block;
          content: '';
          padding-top: 75%; /* 4:3 */
        }

        @media (min-height: 769px) {
          nc-carousel-items::after {
            display: block;
            content: '';
            padding-top: 56.25%; /* 16:9 */
          }
        }

        nc-carousel-items img {
          position: absolute;
          width: 100%;
          height: 100%;
        }
      </style>


      <nc-carousel-items auto-play="[[autoPlay]]" auto-play-time-change="[[autoPlayTimeChange]]">
        <template is="dom-repeat" items="[[carouselData]]" slot="images">
          <img src="[[item.url]]">
        </template>
        
      </nc-carousel-items>
    `;
  }

  static get properties() {
    return {
      autoPlay: {
        type: Boolean,
        value: false
      },
      /* Time in seconds */
      autoPlayTimeChange: Number,
      carouselData: Object
    };
  }
}

customElements.define('nc-carousel', NcCarousel);
