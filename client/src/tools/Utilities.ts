export class Utilities {
  /**
   * Convert a string to title-case.
   * @param input String to convert
   */
  public titleCase(input: string): string {
    if (!input) return '';
    const pieces = [...input.toLowerCase().split(/[\s_-]/)];
    for (let i = 0; i < pieces.length; i++) {
      pieces[i] = pieces[i].charAt(0).toUpperCase() + pieces[i].slice(1);
    }
    return pieces.join(' ');
  }

  /**
   * Format a phone number using regular expressions
   * @param phone
   */
  public formatPhone(phone: string): string {
    if (!phone) return '';
    const regExp = /^(\d{3})(?:-|\s)?(\d{3})(?:-|\s)?(\d{4})(?:\s)?(E?XT?\s?\d{1,})?$/;
    const m = phone.match(regExp);
    if (m) {
      let base = `(${m[1]}) ${m[2]}-${m[3]}`;
      if (m[4]) base += ` [EXT. ${m[4].replace(/\D/g, '')}]`;
      return base;
    }
    return phone;
  }

  /**
   * Copy properties of one object to matching properties
   * of another object. Returns `true` if copy was sucessful
   * and `false` if not.
   * @param a Copy from
   * @param b Copy to
   */
  copyProperties(a: Record<string, any>, b: Record<string, any>): boolean {
    if (!a || !b) false;
    Object.keys(a).forEach((key) => {
      if (typeof b[key] === 'undefined') return;
      b[key] = a[key];
    });
    return true;
  }
}

export default new Utilities();
