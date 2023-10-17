import { Component } from '@angular/core';
import { PasswordManagerService } from '../password-manager.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-site-list',
  templateUrl: './site-list.component.html',
  styleUrls: ['./site-list.component.css']
})
export class SiteListComponent {
  allSites !: Observable<Array<any>>;

  siteName !: string;
  siteURL !: string;
  siteImgURL !: string;
  siteId !: string;

  formState: string = "Add New";

  isSuccess: boolean = false;
  successMessage !: string;

  

  constructor(private passwordManagerService: PasswordManagerService){
    this.loadSites();
  }

  showAlert(message: string) {
    this.isSuccess = true;
    this.successMessage = message;
  }

  onSubmit(values: object) {
    if(this.formState == "Add New") {
      
    console.log(values);
    this.passwordManagerService.addSite(values).then(() => {
      this.showAlert("Data Saved Sucessfully");
      this.resetForm();
    })
    .catch(err => {
      console.log(err);
    })
    }
    
    else if(this.formState == "Edit") {
      this.passwordManagerService.updateSite(this.siteId, values)
      .then(() => {
       this.showAlert("Data Edited Successfully");
       this.resetForm();
      }).catch(err => {
        console.log(err);
      })
    }
  }

  loadSites() {
    this.allSites = this.passwordManagerService.loadSites();
  }

  resetForm() {
    this.siteName = '';
    this.siteURL = '';
    this.siteImgURL = '';
    this.formState = 'Add New';
  }

  editSite(siteName: string, siteURL: string, siteImgURL: string, id: string) {
    this.siteName = siteName;
    this.siteURL = siteURL;
    this.siteImgURL = siteImgURL;
    this.siteId  = id;

    this.formState = "Edit";
  }

  deleteSite(id: string) {
    this.passwordManagerService.deleteSite(id)
    .then(() => {
      this.showAlert("Data Deleted Successfully");
    }).catch(err => {
      console.log(err);
    })
  }
}
