# COS30045 – Data Visualisation  
## Exercise 0.2 – Energy Website

Welcome to **Exercise 0.2** for COS30045 Data Visualisation.

In this exercise, you will build a simple **Energy Data Webpage** using **HTML, CSS, and JavaScript**. The purpose of this exercise is to familiarise you with the development workflow using **GitHub and VS Code**, while preparing the foundation for future data visualisation tasks.

---

# Objective

The objectives of this exercise are:

- Understand how to use **GitHub for version control**
- Practice **web development structure**
- Build a **basic website**
- Maintain **regular commits**
- Identify commits that include **GenAI-generated code**

---

# Step 1 – Fork the Repository

1. Open this repository.
2. Click **Fork** at the top right of the page.
3. This will create a copy of the repository in your GitHub account.

Example:

Original repository : "github.com/rishmaf/COS30045-Data-Visualization/energy-webpage"

Your forked repository : "github.com/yourusername/COS30045-Data-Visualization/energy-webpage"


---

# Step 2 – Clone the Repository

Clone your forked repository to your local machine using **VS Code** or the terminal.



# Step 3 – Project Structure


Your project must follow the structure below.

```bash
energy-webpage-v1
│
├── css
│   └── styles.css
│
├── js
│   └── scripts.js
│
├── images
│   └── PowerIcon.png
│
├── data
│   └── data.csv
│
├── index.html
└── README.md

## Data Story

### Audience
This data story is written for three groups:

- **Consumers** shopping for a new television who want to know whether the Energy Rating star label is worth trusting, and how much size and panel technology actually affect running costs.
- **Policy makers and regulators** interested in whether the current Energy Rating scheme (GEMS) is doing its job of separating efficient models from inefficient ones.
- **Researchers** studying energy efficiency trends in consumer electronics, who need an honest picture of what a real registration dataset does and doesn't show.

### Why they care
All three audiences share one underlying question: *does the label on the box reflect real-world energy use, and what actually drives that use?* Consumers want a shortcut they can trust at the point of purchase. Regulators want evidence the labelling scheme is working as intended. Researchers want to see whether commonly assumed drivers (screen size) hold up against less obvious ones (panel technology, star rating) once real data is examined. The data story walks through screen technology, screen size, and star rating in that order, building toward a single practical takeaway: within any screen size, the efficiency gap between the best and worst model is still large enough to be worth checking before buying.

## About the Data

### Data source
The dataset is drawn from the Australian Government Energy Rating product registration database (`tv_2026_02_15.csv`), containing 4,724 television models approved for sale in Australia as of 15 February 2026. Each row is one registered model, including its brand, screen size, panel technology, measured power draw, star rating, and labelled annual energy consumption.

### Data processing
- Selected the fields relevant to the story: screen size, screen technology, average mode power, star rating, and labelled annual consumption (kWh/year).
- Checked for missing values in these fields — none were found; all 4,724 records were complete for the attributes used.
- Removed non-physical or zero values (e.g. size, power, or consumption of 0) before charting.
- Aggregated the cleaned data into summary tables (counts by technology, average power/consumption by technology, average consumption by star-rating band, average power by screen-size band) to drive the site's charts, alongside the full point-level data for the scatter plots.

### Privacy
The dataset contains no personal or sensitive information. It records product specifications and standardised lab test results for television models — no individual users, purchasers, or personal data are involved at any stage.

### Accuracy and limitations
- The dataset reflects **registrations**, not sales — a popular model resubmitted across several sizes appears multiple times, so counts should not be read as market share.
- Power and consumption figures come from standardised lab testing (fixed test content, fixed brightness settings) and will differ from real-world use, which depends on brightness settings, content type, and hours of use.
- Some fields in the original file (brand website, tuner type) were incomplete and were excluded rather than filled in or guessed.
- This is a snapshot as of February 2026, not a historical time series, so trends over time cannot be drawn from it.

### Ethics
This project follows the ethical visualisation practices set out in the exercise brief:
- All chart axes use a true-zero baseline; no truncated or rescaled axes are used to exaggerate differences.
- Every averaged figure is shown alongside its sample size, so small groups are not given the same visual weight as large, well-supported ones.
- Comparisons (e.g. "OLED uses more energy on average") are explicitly qualified with the confound that explains them (screen size mix), rather than left to imply a simpler causal story than the data supports.
- The limitations above are stated directly on the data story page itself, not only here, so a reader encountering the charts has the same context as a reader of this README.

## AI Declaration
Generative AI (Claude, by Anthropic) was used during the development of this Data Story exercise to help clean and aggregate the dataset, draft the HTML/CSS/JavaScript for the data-story page and its charts, and draft this README content. All code, charts, and written content were reviewed, tested, and understood by the author before submission, consistent with the declaration already made on the site's About page.
