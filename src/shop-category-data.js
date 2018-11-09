import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {Debouncer} from '@polymer/polymer/lib/utils/debounce.js';
import {timeOut} from '@polymer/polymer/lib/utils/async.js';

let categoryList = [
    {
        name: 'mochila',
        title: 'Mochilas',
        image: 'images/mens_outerwear.jpg',
        placeholder: 'data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAeAAD/7gAOQWRvYmUAZMAAAAAB/9sAhAAQCwsLDAsQDAwQFw8NDxcbFBAQFBsfFxcXFxcfHhcaGhoaFx4eIyUnJSMeLy8zMy8vQEBAQEBAQEBAQEBAQEBAAREPDxETERUSEhUUERQRFBoUFhYUGiYaGhwaGiYwIx4eHh4jMCsuJycnLis1NTAwNTVAQD9AQEBAQEBAQEBAQED/wAARCAADAA4DASIAAhEBAxEB/8QAXAABAQEAAAAAAAAAAAAAAAAAAAIEAQEAAAAAAAAAAAAAAAAAAAACEAAAAwYHAQAAAAAAAAAAAAAAERMBAhIyYhQhkaEDIwUVNREBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A3dkr5e8tfpwuneJITOzIcmQpit037Bw4mnCVNOpAAQv/2Q=='
    },
    {
        name: 'caneca',
        title: 'Canecas',
        image: 'images/ladies_outerwear.jpg',
        placeholder: 'data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAeAAD/7gAOQWRvYmUAZMAAAAAB/9sAhAAQCwsLDAsQDAwQFw8NDxcbFBAQFBsfFxcXFxcfHhcaGhoaFx4eIyUnJSMeLy8zMy8vQEBAQEBAQEBAQEBAQEBAAREPDxETERUSEhUUERQRFBoUFhYUGiYaGhwaGiYwIx4eHh4jMCsuJycnLis1NTAwNTVAQD9AQEBAQEBAQEBAQED/wAARCAADAA4DASIAAhEBAxEB/8QAWQABAQAAAAAAAAAAAAAAAAAAAAEBAQEAAAAAAAAAAAAAAAAAAAIDEAABAwMFAQAAAAAAAAAAAAARAAEygRIDIlITMwUVEQEBAAAAAAAAAAAAAAAAAAAAQf/aAAwDAQACEQMRAD8Avqn5meQ0kwk1UyclmLtNj7L4PQoioFf/2Q=='
    },
    {
        name: 'camisa',
        title: 'Camisas masculinas',
        image: 'images/mens_tshirts.jpg',
        placeholder: 'data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAeAAD/7gAOQWRvYmUAZMAAAAAB/9sAhAAQCwsLDAsQDAwQFw8NDxcbFBAQFBsfFxcXFxcfHhcaGhoaFx4eIyUnJSMeLy8zMy8vQEBAQEBAQEBAQEBAQEBAAREPDxETERUSEhUUERQRFBoUFhYUGiYaGhwaGiYwIx4eHh4jMCsuJycnLis1NTAwNTVAQD9AQEBAQEBAQEBAQED/wAARCAADAA4DASIAAhEBAxEB/8QAWwABAQEAAAAAAAAAAAAAAAAAAAMEAQEAAAAAAAAAAAAAAAAAAAAAEAABAwEJAAAAAAAAAAAAAAARAAESEyFhodEygjMUBREAAwAAAAAAAAAAAAAAAAAAAEFC/9oADAMBAAIRAxEAPwDb7kupZU1MTGnvOCgxpvzEXTyRElCmf//Z'
    },
    {
        name: 'camiseta',
        title: 'Camisetas',
        image: 'images/ladies_tshirts.jpg',
        placeholder: 'data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAeAAD/7gAOQWRvYmUAZMAAAAAB/9sAhAAQCwsLDAsQDAwQFw8NDxcbFBAQFBsfFxcXFxcfHhcaGhoaFx4eIyUnJSMeLy8zMy8vQEBAQEBAQEBAQEBAQEBAAREPDxETERUSEhUUERQRFBoUFhYUGiYaGhwaGiYwIx4eHh4jMCsuJycnLis1NTAwNTVAQD9AQEBAQEBAQEBAQED/wAARCAADAA4DASIAAhEBAxEB/8QAXwABAQEAAAAAAAAAAAAAAAAAAAMFAQEBAAAAAAAAAAAAAAAAAAABAhAAAQIDCQAAAAAAAAAAAAAAEQABITETYZECEjJCAzMVEQACAwAAAAAAAAAAAAAAAAAAATFBgf/aAAwDAQACEQMRAD8AzeADAZiFc5J7BC9Scek3VrtooilSNaf/2Q=='
    }
];

class ShopCategoryData extends PolymerElement {

    static get is() {
        return 'shop-category-data';
    }

    static get properties() {
        return {

            categoryName: String,

            itemName: String,

            categories: {
                type: Array,
                value: categoryList,
                readOnly: true,
                notify: true
            },

            category: {
                type: Object,
                computed: '_computeCategory(categoryName)',
                notify: true
            },

            item: {
                type: Object,
                computed: '_computeItem(category.items, itemName)',
                notify: true
            },

            failure: {
                type: Boolean,
                notify: true,
                readOnly: true
            }

        }
    }

    _getCategoryObject(categoryName) {

        for (let i = 0, c; c = this.categories[i]; ++i) {
            if (c.name === categoryName) {
                return c;
            }
        }
    }

    _computeCategory(categoryName) {
        // Fetch the items of the category. Note that the fetch is asynchronous,
        // which means `category.items` may not be set initially (but that path
        // will be notified when the fetch completes).
        let categoryObj = this._getCategoryObject(categoryName);
        this._fetchItems(categoryObj, 1);
        return categoryObj;
    }

    _computeItem(items, itemName) {
        if (!items || !itemName) {
            return;
        }
        for (let i = 0, item; item = items[i]; ++i) {
            if (item.name === itemName) {
                return item;
            }
        }
    }

    _fetchItems(category, attempts) {
        this._setFailure(false);
        // Only fetch the items of a category if it has not been previously set.
        if (!category || category.items) {
            return;
        }
        this._getResource({
            // url: 'data/' + category.name + '.json',
            url: "http://localhost:3000/api/v1/products.json",
            // url: "http://localhost:3000/getproducts?token=0ef005fa2a55a005a316ae0f40c424cae820f4804e5acad8",
            categoryName: category.name,
            onLoad(e) {

                let items2 = JSON.parse(e.target.responseText);
                let aux=[];
                items2 = items2.products;
                for(let i = 0; i < items2.length; i++){
                    let taxon =  category.name;
                    let name, title, price, description, image, lImage;
                    name = items2[i].name ? items2[i].name : "";
                    title = items2[i].name ? items2[i].name : "";
                    price =  Number(items2[i].price);
                    description = items2[i].description;
                    if(items2[i].master){
                        if(items2[i].master.images){
                            lImage ="http://localhost:3000" + items2[i].master.images[0].large_url;
                            image ="http://localhost:3000" + items2[i].master.images[0].small_url;
                        }
                    }
                    let p = {
                        "name": name,
                        "title": title,
                        "category": taxon,
                        "price":price,
                        "description": description,
                        "image": image,
                        "largeImage":lImage
                    }
                    aux.push(p);
                    console.log("response from spree api-=====>",p);
                }
                this.set('category.items', aux);
            },
            onError(e) {
                this._setFailure(true);
            }
        }, attempts);
    }

    //put iron-ajax here
    _getResource(rq, attempts) {
        let xhr = new XMLHttpRequest();

        xhr.addEventListener('load', rq.onLoad.bind(this));
        xhr.addEventListener('error', (e) => {
            // Flaky connections might fail fetching resources
            console.log("olha aki o...");
            if (attempts > 1) {
                this._getResourceDebouncer = Debouncer.debounce(this._getResourceDebouncer,
                    timeOut.after(200), this._getResource.bind(this, rq, attempts - 1));
            } else {
                rq.onError.call(this, e);
            }
        });

        xhr.open('GET', rq.url + "?q[name_cont]="+ rq.categoryName);
        xhr.setRequestHeader('X-Spree-Token', '0ef005fa2a55a005a316ae0f40c424cae820f4804e5acad8')
        xhr.send();
    }

    refresh() {
        if (this.categoryName) {
            // Try at most 3 times to get the items.
            this._fetchItems(this._getCategoryObject(this.categoryName), 3);
        }
    }

}

customElements.define(ShopCategoryData.is, ShopCategoryData);
