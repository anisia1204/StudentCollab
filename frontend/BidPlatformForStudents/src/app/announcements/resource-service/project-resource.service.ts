import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ProjectDtoModel} from "../domain/project-dto.model";

@Injectable({
  providedIn: "root"
})
export class ProjectResourceService {
  private url = "http://localhost:8081/api/project"

  constructor(private httpClient: HttpClient) {
  }

  save(projectDto: ProjectDtoModel) {
    return this.httpClient.post<ProjectDtoModel>(`${this.url}`, projectDto);
  }
}
