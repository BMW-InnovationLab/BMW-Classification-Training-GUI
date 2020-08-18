import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {CheckPointsGetterInfo} from '../Interfaces/check-points-getter-info';
import {IHyperParameters} from '../Interfaces/IHyperParameters';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataGetter {
  serviceUrl = environment.url;
  basePort = environment.baseEndPoint;

  constructor(private http: HttpClient) {
  }

  getAvailableNetworks() {
    return this.http.get<string[]>(this.serviceUrl + this.basePort + '/networks');
  }

  getAvailableGPUs() {
    return this.http.get<number[]>(this.serviceUrl + this.basePort + '/gpu/info');
  }

  /*getAvailableCheckPoints(networkArchitecture: string) {
    const jsn: CheckPointsGetterInfo = {
      network_architecture: networkArchitecture
    };
    return this.http.post<string[]>(this.serviceUrl + this.basePort + '/checkpoints', jsn);
  }*/

  getAvailableCheckPoints() {
    return this.http.get<string[]>(this.serviceUrl + this.basePort + '/checkpoints');
  }

  getDefaultValues(networkArchitecture: string, apiPort: number): Observable<IHyperParameters> {
    const jsn = {
      network_architecture: networkArchitecture
    };
    return this.http.post<IHyperParameters>(this.serviceUrl + apiPort + '/get_default_hyperparameters', jsn);
  }

  getUsedPorts() {
    return this.http.get<string[]>(this.serviceUrl + this.basePort + '/ports');
  }


}
