/* Load the Polymer.Element base class */
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

// Extend Polymer.Element base class
class NcCarouselItems extends PolymerElement {
  static get template() {
    return html`
      <style>

        :host {
          display: block;
          position: relative;
          overflow: hidden;
        }

        div > ::slotted(:not([selected])) {
          display: none;
        }
      </style>

      <div>
        <slot attribute="images"></slot>
      </div>
    `;
  }

  static get properties() {
    return {
      autoPlay: Boolean,
      autoPlayTimeChange: {
        type: Number,
        value: 5
      },
      selected: {
        type: Object,
        observer: '_selectedChanged'
      }
    };
  }

  connectedCallback() {
    super.connectedCallback();

    this.shadowRoot.querySelector('slot[attribute="images"]').addEventListener('slotchange', this._resetSelected.bind(this));
    this._resetSelected();
  }

  _selectedChanged(selected, oldSelected) {
    if (oldSelected) oldSelected.removeAttribute('selected');
    if (selected) selected.setAttribute('selected', '');
  }

  _resetSelected() {
    if (this.childElementCount>1) {
      if (!this.selected || this.selected.parentElement !== this) {
        this.selected = this.firstElementChild;            

        if (this.autoPlay){
          setInterval(() => this.next(), this.autoPlayTimeChange * 1000);
        }
      }
    }
  }

  previous() {
    const elem = this.selected && this.selected.previousElementSibling;
    if (elem && !this._touchDir) {
      // Setup transition start state
      const oldSelected = this.selected;
      this._translateX(oldSelected, 0);
      this._translateX(elem, -this.offsetWidth);

      // Start the transition
      this.selected = elem;
      this._translateX(oldSelected, this.offsetWidth, true /* transition */);
      this._translateX(elem, 0, true /* transition */);
    }
  }

  next() { 
    let elem = (this.selected && this.selected.nextElementSibling);

    if (this.childElementCount > 2){
      if (this.selected.nextElementSibling.nodeName=="DOM-REPEAT") {
        this.selected = this.firstElementChild; 
        elem = this.firstElementChild;
      }
      if (elem && !this._touchDir) {
        // Setup transition start state
        const oldSelected = this.selected;
        this._translateX(oldSelected, 0);
        this._translateX(elem, this.offsetWidth);

        // Start the transition
        this.selected = elem;
        this._translateX(oldSelected, -this.offsetWidth, true /* transition */);
        this._translateX(elem, 0, true /* transition */);
      }
    }
  }

  _translateX(elem, x, transition) {
    elem.style.display = 'block';
    elem.style.transition = transition ? 'transform 0.5s' : '';
    elem.style.transform = 'translate3d(' + x + 'px, 0, 0)';
  }
}

customElements.define('nc-carousel-items', NcCarouselItems);
