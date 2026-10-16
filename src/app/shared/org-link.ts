import { Pipe, PipeTransform, inject } from '@angular/core';
import { OrgContext } from '../core/org/org-context';

/** Prefixes an in-app link with the organization slug: `'/vulnerabilities' | orgLink`. */
@Pipe({ name: 'orgLink' })
export class OrgLink implements PipeTransform {
  private readonly org = inject(OrgContext);

  transform(link: string | (string | number)[]): string | (string | number)[] {
    if (typeof link === 'string') return this.org.url(link);
    const [first, ...rest] = link;
    return [this.org.url(String(first)), ...rest];
  }
}
