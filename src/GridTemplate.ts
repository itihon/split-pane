export default class GridTemplate {
  private splitter = '';
  private parsedTemplate: Array<string> = [];

  constructor(template = '', splitter = 'min-content') {
    this.splitter = splitter;
    if (template.trim().length) {
      this.parsedTemplate = template.split(splitter);
    }
  }

  add(idx: number, value = '1fr') {
    if (idx < 0) {
      this.parsedTemplate.unshift(value);
    } else {
      this.parsedTemplate.splice(idx, 0, value);
    }
  }

  remove(idx: number): boolean {
    if (this.parsedTemplate[idx]) {
      this.parsedTemplate.splice(idx, 1);
      return true;
    }
    return false;
  }

  get(idx: number): string | undefined {
    return this.parsedTemplate[idx];
  }

  set(idx: number, value = '1fr'): boolean {
    if (this.parsedTemplate[idx]) {
      this.parsedTemplate[idx] = value;
      return true;
    }
    return false;
  }

  parse(template: string, splitter = this.splitter) {
    if (template.trim().length) {
      this.parsedTemplate = template.split(splitter);
    }
  }

  build(splitter = this.splitter): string {
    return this.parsedTemplate.join(` ${splitter} `);
  }
}
