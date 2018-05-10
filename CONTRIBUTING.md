# Contribute

The ways to contribute are the following, each of which has a different set of requirements:

- Improve the Front-End (Website).
- Add/Remove Institution (Institutional Email required).
- Suggest new features and improvements.

## Web Site Contribution

You can suggest changes in the front end only if they meet the following:

- No Framework: We want to keep the code as easy as possible since it's the best way to contribute. So no React/Angular/Vue/etc.
- No unecessary libraries: Lots of people are used to JQuery or similar, but each request has its cost so we'd like to keep the number (and size) of the requests to the minimum

**Use the feature request template.**

## Add/Remove Institution

In case you want to add an institution to the map you have three options:

1. Via Google Forms - Recommended
    - Fill this [google form](https://kutt.it/jupyter-map).
2. Via Git - Fastest
    - Download the [GeoJSON](https://kutt.it/jupyter-map-geojson).
    - Add/Remove the data you need.
    - Test the coordinates with [GeoJSON.io](http://geojson.io/).
    - Create an issue with the Add/Remove Institution Template.
    - Submit a Pull Request with the new GeoJSON File.
3. Via Email
    - You have to fill this template and send it to castanoezequielleonardo@gmail.com - Subject: "Jupyter Education Map - Request":
    ```json
        Institution name: MISSING
        Institution website: MISSING
        Course Name: MISSING
        Course Area:  MISSING
        Course URL (optional) : MISSING
        Instructor Name: MISSING
        Instructor Email: MISSING - Institutional email required
        Contact Name: MISSING
        Contact Email: MISSING - Institutional email required
    ```
    `NOTE: If you have more than one course you could send one email but each course should have a separated template.`

After that, you will receive a confirmation email with all the details. This process could take some days.

If you choose Google Forms all the steps will be more or less automated, in case of git, the format should be consistent or otherwise the PR would be rejected.

## Suggest new features and improvements

Simply create an issue and propose the suggested changes

Thanks for all your support