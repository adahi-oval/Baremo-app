import requests
from bs4 import BeautifulSoup
import pandas as pd
import re
from urllib.parse import urljoin
import time

response = requests.get("https://portalciencia.ull.es/unidades/5510/investigadores")
page = BeautifulSoup(response.content, 'html.parser')

def get_data(classname_suffix, missingIndex=None):
    selector = f".unidad-miembros__items .c-persona-card__{classname_suffix}"
    elements = [el.get_text(strip=True) for el in page.select(selector)]
    if not elements:
        return ["N/A"]  # Return a default value if empty
    if missingIndex is not None:
        elements.insert(missingIndex, "N/A")
    return elements

names = get_data("nombre")
missingIndex = names.index("Coromoto León")
surnames = get_data("apellidos", missingIndex)
fields = get_data("caption")

links = [
urljoin("https://portalciencia.ull.es", str(a['href']))
for a in page.select(".unidad-miembros__items .c-persona-card__detalles a")
]
publication_links = [link.replace("detalle", "publicaciones") for link in links]

def get_publications(link: str, pub_type: str, year: str, size: int) -> list[str]:
# Construct the full URL with query parameters
    new_link = f"{link}?f=true&agrTipoPublicacion={pub_type}&tipo=&min={year}&max={year}&size={size}"
    
    # Request the page
    response = requests.get(new_link)
    response.raise_for_status()  # Raise exception for HTTP errors
    
    # Parse the page content
    soup = BeautifulSoup(response.text, "html.parser")
    
    # Extract publication details
    publications_details = [
        elem.get_text(strip=True)
        for elem in soup.select(".c-doc")
    ]

    return publications_details

def get_publication_link(link: str, pub_type: str, year: str, size: int) -> list[str]:
    # Build the full URL
    new_link = f"{link}?&min={year}&max={year}&agrTipoPublicacion={pub_type}&size={size}"
    
    # Request and parse the page
    response = requests.get(new_link)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")
    
    # Extract href attributes and prepend base URL
    base_url = "https://portalciencia.ull.es"
    publication_links = [
        base_url + str(a.get("href"))
        for a in soup.select(".c-doc a")
        if a.get("href")
    ]
    
    return publication_links


def get_publications_data(links, pub_type, year):
    print("11...")
    total_publications = []
    count = 0

    for link in links:
        count += 1
        print(f"12... {count}")
        new_link = f"{link}?&min={year}&max={year}&agrTipoPublicacion={pub_type}"
        page = BeautifulSoup(requests.get(new_link).content, "html.parser")
        spans = page.select(".investigador-docs__title span")

        try:
            n = int(spans[1].text)
        except (IndexError, ValueError):
            n = 0

        total_publications.append(n)

    indexes0 = [i for i, n in enumerate(total_publications) if n == 0]
    filtered_links = [l for i, l in enumerate(links) if i not in indexes0]
    filtered_counts = [n for n in total_publications if n != 0]

    all_publications = []
    all_links = []

    for i, link in enumerate(filtered_links):
        print(f"15... {i+1}")
        all_publications.extend(get_publications(link, pub_type, year, filtered_counts[i]))
        all_links.extend(get_publication_link(link, pub_type, year, filtered_counts[i]))

    return indexes0, filtered_counts, all_publications, all_links

def get_doi(links):
    return ["10.xxx/yyy"] * len(links)

def get_isbn(links, year):
    return ["978-xxxx-yyyy"] * len(links)

def create_df(indexes0, counts, pubs, extra):
    filtered_names = [names[i] for i in range(len(names)) if i not in indexes0]
    filtered_surnames = [surnames[i] for i in range(len(surnames)) if i not in indexes0]
    filtered_fields = [fields[i] for i in range(len(fields)) if i not in indexes0]

    rows = []
    j = 0
    for i in range(len(filtered_names)):
        for pub in pubs[j: j + (counts[i])]:
            rows.append({
                "Nombre": filtered_names[i],
                "Apellidos": filtered_surnames[i],
                "Area": filtered_fields[i],
                "Num_Publicaciones": counts[i],  # Each row represents one publication
                "Publicacion": pub
            })
        
        j += counts[i]

    df = pd.DataFrame(rows)

    df_missing = pd.DataFrame({
        "Nombre": [names[i] for i in indexes0],
        "Apellidos": [surnames[i] for i in indexes0],
        "Area": [fields[i] for i in indexes0],
        "Num_Publicaciones": 0,
        "Publicacion": [None] * len(indexes0),
        "Extra": [None] * len(indexes0)
    })

    return pd.concat([df, df_missing], ignore_index=True).sort_values("Apellidos")


indexes0, counts, pubs, extra = get_publications_data(publication_links, "BOOK", "2024")
df_books = create_df(indexes0, counts, pubs, get_isbn(publication_links, "2024"))

indexes0, counts, pubs, extra = get_publications_data(publication_links, "ARTICLE", "2024")
df_articles = create_df(indexes0, counts, pubs, get_doi(publication_links))

indexes0, counts, pubs, extra = get_publications_data(publication_links, "BOOK_CHAPTER", "2024")
df_chapter = create_df(indexes0, counts, pubs, get_doi(publication_links))

indexes0, counts, pubs, extra = get_publications_data(publication_links, "CONFERENCE_PAPER", "2024")
df_conference = create_df(indexes0, counts, pubs, get_doi(publication_links))

indexes0, counts, pubs, extra = get_publications_data(publication_links, "OTROS", "2024")
df_other = create_df(indexes0, counts, pubs, get_doi(publication_links))

df_articles.to_csv("articulos.csv", index=True)

df_books.to_csv("libros.csv", index=True)
df_chapter.to_csv("capitulos.csv", index=True)
df_conference.to_csv("conferencias.csv", index=True)

df_other.to_csv("otros.csv", index=True)
