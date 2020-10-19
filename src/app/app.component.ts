import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

const URL = 'https://api.spaceXdata.com/v3/launches?limit=100';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  years = [2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020];
  selectedYear: number;
  isLaunchSuccess = null;
  isLandSuccess = null;
  launchList = [];
  subs: Subscription;
  isLoading: boolean;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit() {
    console.log('ngoninit');
    this.route.queryParams.subscribe(params => {
      console.log('query params ', params);

      this.getList(params);
    });
    // this.getList();
  }

  getList(params?) {
    if (this.subs) {
      this.subs.unsubscribe();
    }
    let httpPar = new HttpParams();

    if (params) {
      if (params.launch_success) {
        this.isLaunchSuccess = params.launch_success === 'true' ? true : false;
        httpPar = httpPar.append('launch_success', this.isLaunchSuccess);
      } else {
        this.isLaunchSuccess = null;
      }

      if (params.land_success) {
        this.isLandSuccess = params.land_success === 'true' ? true : false;
        httpPar = httpPar.append('land_success', this.isLandSuccess);
      } else {
        this.isLandSuccess = null;
      }

      if (params.launch_year) {
        this.selectedYear = Number(params.launch_year);
        httpPar = httpPar.append('launch_year', String(params.launch_year));
      } else {
        this.selectedYear = null;
      }
    }

    this.isLoading = true;
    this.subs = this.httpClient.get(URL, { params: httpPar }).subscribe((res: any) => {
      this.launchList = res;
      this.isLoading = false;
    });
  }

  onFilter(key: 'year' | 'launch' | 'land', flag) {
    console.log('on filter ', key, flag);
    if (key === 'year') {
      if (this.selectedYear === flag) {
        this.selectedYear = null;
      } else {
        this.selectedYear = flag;
      }
    } else if (key === 'launch') {
      if (this.isLaunchSuccess === flag) {
        this.isLaunchSuccess = null;
      } else {
        this.isLaunchSuccess = flag;
      }
    } else if (key === 'land') {
      if (this.isLandSuccess === flag) {
        this.isLandSuccess = null;
      } else {
        this.isLandSuccess = flag;
      }
    }

    const params: any = {};
    if (this.isLaunchSuccess != null) {
      params.launch_success = this.isLaunchSuccess;
    }
    if (this.isLandSuccess != null) {
      params.land_success = this.isLandSuccess;
    }
    if (this.selectedYear) {
      params.launch_year = this.selectedYear;
    }

    this.router.navigate([''], { queryParams: params });
  }

}
