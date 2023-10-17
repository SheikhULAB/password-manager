import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PasswordManagerService } from '../password-manager.service';
import { Observable } from 'rxjs';
import {AES, enc} from "crypto-js";

@Component({
  selector: 'app-password-list',
  templateUrl: './password-list.component.html',
  styleUrls: ['./password-list.component.css']
})
export class PasswordListComponent {
  siteId !: string;
  siteName !: string;
  siteURL !: string;
  siteImgURL !: string;

  passwordList !: Observable<Array<any>>

  email !: string;
  username !: string;
  password !: string;
  passwordId !: string;

  formState : string = 'Add New';

  isSuccess: boolean = false;
  successMessage !: string;

  constructor(private route: ActivatedRoute, private PasswordManagerService: PasswordManagerService) {
    this.route.queryParams.subscribe((value: any) => {
      this.siteId = value.id;
      this.siteName =value.siteName;
      this.siteURL = value.siteURL;
      this.siteImgURL = value.siteImgURL;
    })
    this.loadPassword();
  }

  showAlert(message: string) {
    this.isSuccess = true;
    this.successMessage = message;
  }

  onSubmit(values: any) {
    this.encryptPassword(values.password);
    if(this.formState == 'Add New') {
      this.PasswordManagerService.addPassword(values, this.siteId)
      .then(() => {
       this.showAlert("data saved successfully");
       this.resetForm();
      }).catch((err) => {
       console.log(err);
      })    
    } 
    else if(this.formState == 'Edit') {
      this.PasswordManagerService.updatePassword(this.siteId, this.passwordId, values)
      .then(() => {
        this.showAlert("Data updated succesfully");
        this.resetForm();
      }).catch((err) => {
        console.log(err);
      })
    }
   
  }

  loadPassword(){
    this.passwordList = this.PasswordManagerService.loadPasswords(this.siteId);
  }

  resetForm() {
    this.email = '';
    this.username = '';
    this.password = '';
    this.formState = 'Add New';
    this.passwordId = '';
  }

  editPassword(email: string, username: string, password: string, passwordId: string) {
     this.email = email;
     this.username = username;
     this.password = password;
     this.passwordId = passwordId;

     this.formState = 'Edit';
   }

   deletePassword(passwordId: string) {
    this.PasswordManagerService.deletePassword(this.siteId, passwordId)
    .then(() => {
      this.showAlert("data deleted successfully");
      
    }).catch((err) => {
      console.log(err);
    })
   }

   encryptPassword(password: string) {
    const secretKey = '5F91C87DF5169BE6E6FD47D9618F7';
    const encryptedPassword = AES.encrypt(password, secretKey).toString();
    return encryptedPassword;
   }

}
