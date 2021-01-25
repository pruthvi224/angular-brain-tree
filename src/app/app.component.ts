import {HttpClient} from '@angular/common/http';
import {Payment} from './app.model';
import { Component, OnInit, OnDestroy, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import * as braintree from 'braintree-web';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular-brain-tree';
  token = '';
  nonceToken: string;
  amount: number;
  script: any;

  payment = new Payment();
  payPalInstance: braintree.PayPalCheckout;
  cardholdersName: string;
  constructor(private http: HttpClient, private renderer: Renderer2, @Inject(DOCUMENT) private document: any) {

    this.getToken();
  }

  // createPaypalIntegration() {
  //   braintree.setup();
  // }
  // createBraintreeUI() {
  //   braintree.client.create({
  //     authorization: this.token
  //   }).then((clientInstance) => {
  //      braintree.paypal.create({
  //       client: clientInstance
  //     }).then((paypalCheckoutInstance) => {
  //       const payButton = this.document.querySelector('.paypal-button');
  //       payButton.removeAttribute('disabled');
  //       // this.payPalInstance = paypalCheckoutInstance;
  //       payButton.addEventListener('click', (event) => {
  //         paypalCheckoutInstance.tokenize({
  //           flow: 'vault'
  //         }).then((payload) => {
  //           console.log('Got a nonce! You should submit this to your server.');
  //           console.log(payload.nonce);
  //           console.log(payload);
  //           this.nonceToken = payload.nonce;
  //           // this.payment.none_token = this.nonceToken;
  //           // this.payment.amount = 1;
  //           // this.http.post('https://b8bf5467ec3d.ngrok.io/transaction', this.payment).subscribe( p => console.log(p));
  //         });
  //       });
  //     });
  //   });
  // }

  createPaypalInstance() {
    braintree.client.create({
      authorization: this.token
    }).then(brainTreeInstance => {
      return braintree.paypalCheckout.create({
        client: brainTreeInstance
      }).then((ppCheckOutInstance) => {
        const payButton = this.document.querySelector('.paypal-button');
        payButton.addEventListener('click', (event) => {
          ppCheckOutInstance.tokenize({
            flow: 'vault'
          }).then((payload) => {
            console.log('Got a nonce! You should submit this to your server.');
            console.log(payload.nonce);
            console.log(payload);
            this.nonceToken = payload.nonce;
            // this.payment.none_token = this.nonceToken;
            // this.payment.amount = 1;
            // this.http.post('https://b8bf5467ec3d.ngrok.io/transaction', this.payment).subscribe( p => console.log(p));
          });
        });
      });
    });
  }


  // tslint:disable-next-line:typedef
  // findLabel(field: braintree.HostedFieldsHostedFieldsFieldData) {
  //   return document.querySelector('.hosted-field--label[for="' + field.container.id + '"]');
  // }
  // tslint:disable-next-line:typedef
  // tokenizeUserDetails() {
  //   this.hostedFieldsInstance.tokenize({cardholderName: ''}).then((payload) => {
  //     console.log(payload);
  //     if (payload) {
  //       this.nonceToken = payload.nonce;
  //       this.payment.none_token = this.nonceToken;
  //       this.payment.amount = this.amount;
  //       this.http.post('https://b8bf5467ec3d.ngrok.io/transaction', this.payment).subscribe( p => console.log(p));
  //     }
  //   }).catch((error) => {
  //     console.log(error);
  //   });
  // }

  getToken() {
    this.http.get('https://b8bf5467ec3d.ngrok.io/token').subscribe((p: any) => {
      if (p) {
        this.token = p.clientToken;
      } else {
        this.token = 'sandbox_5rnr7xqg_kx8tzdyvfcrnxq5y';
      }
      // this.token = 'sandbox_5rnr7xqg_kx8tzdyvfcrnxq5y';
      // if (this.token) {
      //   this.createBraintreeUI();
      // }

      if (this.token) {
          this.createPaypalInstance();
        }
    });
  }
  // tslint:disable-next-line:typedef
  ngOnInit() {
    // this.createBraintreeUI();
    this.script = this.renderer.createElement('script');
    this.script.type = 'text/javascript';
    // this.script.src = 'https://js.braintreegateway.com/web/dropin/1.13.0/js/dropin.min.js';
    // this.renderer.appendChild(this.document.body, this.script);
  }

  ngOnDestroy() {
    this.renderer.removeChild(this.document.body, this.script);
  }
}
