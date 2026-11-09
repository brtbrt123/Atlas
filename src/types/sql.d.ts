// `.sql` migration files are bundled as strings (Metro in the app, a transformer in Jest).
declare module '*.sql' {
  const content: string;
  export default content;
}
