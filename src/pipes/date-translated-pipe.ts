import { PipeTransform, Pipe } from '@angular/core';
import * as moment from 'moment';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

// 言語によってDateを整形するPipe
@Pipe({
  name: "dateTranslated"
})
export class DateTranslatedPipe implements PipeTransform {
  constructor(
    public translate: TranslateService) {
  }
  transform(date: string): string {
    let dateTranslated;
    this.translate.get("DATE_FORMAT").subscribe((res: string) => {
      dateTranslated = moment(date).format(res);
    });
    return dateTranslated;
  }
}