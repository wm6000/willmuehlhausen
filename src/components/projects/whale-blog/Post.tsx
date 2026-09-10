import { Figure, Link, Stack, Text } from "@/ui";
import { PostSection } from "@/components/projects/PostSection";
import { WhaleMap } from "@/components/projects/whale-blog/WhaleMap";

/**
 * Ported from the old Flask site's whales.html, which is the version of record:
 * https://github.com/wm6000/Website-WillsWebsite (willswebsiteapp/templates/whales.html)
 *
 * The prose is unchanged. What changed is the three maps: they were Folium exports
 * embedded as iframes totalling 40.4MB, and they are now rebuilt from the underlying
 * data — see WhaleMap for why, and scripts/extract-whale-maps.mjs for how.
 */

const REFERENCES = [
  {
    label: "NOAA Gray Whale Species Overview",
    href: "https://www.fisheries.noaa.gov/species/gray-whale#overview",
  },
  { label: "OBIS-SEAMAP", href: "https://seamap.env.duke.edu/" },
  {
    label: "World Bank Global Shipping Traffic Density",
    href: "https://datacatalog.worldbank.org/search/dataset/0037580/Global-Shipping-Traffic-Density",
  },
  {
    label: "New Protections for Endangered Whales Along the California Coast Adopted",
    href: "https://www.noaa.gov/news-release/new-protections-for-endangered-whales-along-california-coast-adopted",
  },
  {
    label: "Migration of the Gray Whale",
    href: "http://www.marinebio.net/marinescience/05nekton/GWmigration.htm",
  },
];

export function Post() {
  return (
    <Stack gap={7}>
      <PostSection id="intro" title="Intro">
        <Text prose>
          Living in the Pacific Northwest, I have always been surrounded by bodies of water where
          whales reside. Despite this, sightings of orcas and other whales are rare, even when
          visiting the Puget Sound. Although they are always present, I had never seen one until
          last year when I was swimming along the shores of an island in the Puget Sound, and a
          gray whale surfaced just 50 feet away from me. It was an exhilarating moment, and since
          then, every time I look out into the Puget Sound, it feels much more alive.
        </Text>
      </PostSection>

      <PostSection id="data" title="Data">
        <Text size="md" tone="muted" balance>
          How do shipping routes intersect with whale habitat?
        </Text>
        <Text prose>
          This experience sparked my curiosity to explore how human activities affect whale
          behavior and their habitats. I started by pulling data on gray whale and blue whale
          sightings from the OBIS-SEAMAP database, which provides a valuable resource for marine
          biologists, researchers, and enthusiasts to access and analyze{" "}
          <Link to="https://seamap.env.duke.edu/" external>
            marine mammal data
          </Link>
          .
        </Text>
        <Text prose>
          As I continued researching, I came across the issue of global shipping traffic density
          and its impact on whale populations. It was interesting to see how these routes often
          intersect with areas of high whale density. To gain a better understanding of this issue,
          I searched for a dataset on the World Bank website that provides a .tif file on{" "}
          <Link
            to="https://datacatalog.worldbank.org/search/dataset/0037580/Global-Shipping-Traffic-Density"
            external
          >
            global shipping traffic density
          </Link>
          .
        </Text>
        <Text prose>
          By analyzing these datasets, I hope to shed light on the relationship between human
          activity and whale behavior and contribute to the ongoing conversation on how to protect
          these magnificent creatures and their habitats. Here is the data:
        </Text>
        <WhaleMap variant="intro" />
      </PostSection>

      <PostSection id="lanes" title="Los Angeles Shipping Lanes">
        <Text size="md" tone="muted" balance>
          How do Gray and Blue Whales intersect with global shipping routes?
        </Text>
        <Text prose>
          Whales in the Los Angeles port area are significantly impacted by shipping routes due to
          the heavy traffic of commercial vessels. Large ships produce intense underwater noise
          that can disrupt the natural behavior and communication of whales, making it harder for
          them to find food and navigate their migration routes. Furthermore, the collision risk
          between whales and ships is high in this area, as whales often swim near the surface,
          making them difficult to spot from the ships. In recent years, several measures have been
          implemented to mitigate these impacts, including reducing ship speeds, rerouting ships
          away from critical whale habitats, and developing new technologies to reduce ship noise.
          Despite these efforts, the impacts of shipping routes on whales remain a major concern in
          the Los Angeles port area. Even{" "}
          <Link
            to="https://www.noaa.gov/news-release/new-protections-for-endangered-whales-along-california-coast-adopted"
            external
          >
            recently
          </Link>{" "}
          there have been adjustments to the shipping routes along the California coast.
        </Text>
        <Text prose>
          Scanning map along the west coast and seeing where there is overlap between the shipping
          lanes and whale sightings, I noticed that the Los Angeles port and the surrounding
          Channel Islands would be a good place to take a closer look.
        </Text>
        <WhaleMap variant="la" />
        <Text prose>
          When examining the shipping lanes that leave the Los Angeles port and head north, we can
          observe that most of them follow a particular path that goes through the Santa Barbara
          Channel and the archipelago just south of it. This path happens to intersect with a
          significant concentration of blue whales sightings.
        </Text>
        <Text prose>
          To better visualize this on the map, you can click on the layers button on the top right
          corner and select &lsquo;Reroute&rsquo;. From the data presented, it appears that
          rerouting the shipping lanes in this area would be a wise alternative. By doing so, we
          could avoid disturbing the high-density whale populations and reduce the risk of ship
          strikes and noise pollution. I have come across a news article that reports an amendment
          to the existing shipping lane in this area. Although it is a positive step forward, as
          you can see from the data presented, there is still evidence that rerouting the shipping
          lane around the island would be a more effective solution.
        </Text>
        <Text prose>
          To explore the potential for other reroute options along the West Coast, zoom out to see
          the two other locations that I identified: San Francisco and San Diego.
        </Text>
        <Text prose>
          In the case of San Francisco, the established shipping path enters and leaves the Bay
          Area via a trident-shaped route. However, the northern spoke of the trident passes
          through a region of high-density blue and gray whale sightings. Rerouting the shipping
          lanes along the central spoke of the trident would avoid this area and minimize the
          disturbance to these whale populations.
        </Text>
        <Text prose>
          As for San Diego, there isn&rsquo;t a defined shipping lane route like the two big city
          ports mentioned earlier. However, a closer examination of the data reveals that the
          density of whale populations is higher to the north of the port. Therefore, establishing
          a shipping lane route similar to that of Los Angeles and San Francisco but going
          southwest would be a reasonable approach.
        </Text>
        <Text prose>
          There are several opportunities to reroute shipping lanes along the West Coast in order
          to protect vulnerable whale populations while still maintaining efficient transportation
          routes. While it could be argued that rerouting shipping lanes may incur additional costs
          and utilize more resources and fuel, finding a balance between conservation efforts and
          shipping efficiency is crucial. By identifying and implementing these alternatives, we
          can mitigate the negative impact of shipping on marine wildlife and their habitats, which
          is essential for ensuring a healthy and sustainable ocean ecosystem for generations to
          come.
        </Text>
      </PostSection>

      <PostSection id="migration" title="Gray Whale Migration">
        <Text size="md" tone="muted" balance>
          How do Gray whales intersect with global shipping routes depending on the month?
        </Text>
        <Text prose>
          I wanted to take a closer look at when Gray Whales would be migrating along the West
          Coast. The gray whale migration is one of the longest and most remarkable migrations of
          any mammal on earth. Gray whales travel over 10,000 miles each year, from their feeding
          grounds in the Arctic waters in the summer to their breeding and calving grounds in the
          warm waters of Baja California, Mexico in the winter.
        </Text>
        <WhaleMap variant="migration" />
        <Text prose>
          Press play and observe how the whale sightings on the heatmap vary by month. Initially,
          we can see that there are whale sightings all along the entire migration route. However,
          it is recommended to zoom in on the Los Angeles area to see how the density of whale
          sightings change. During December to March, the highest number of Gray whales are present
          in LA. This same pattern is observed in the Baja breeding grounds. If we move up to
          Alaska, there are sightings of whales for most months, but especially during the summer
          months.
        </Text>
        <Text prose>
          I was curious what if there was any information on the physical path of a Gray Whale
          migration and I found this photo from Marinebio.net:
        </Text>
        <Figure
          src="/whales/gray-whale-migration.jpg"
          alt="Diagram of the gray whale migration route along the west coast of North America, showing the southbound path offshore and the northbound path close to the coast"
          caption="Migration of the Gray Whale — Marinebio.net"
        />
        <Text prose>
          As you can see when heading south, many of the gray whales swim offshore and when coming
          north, they swim along the shores. This is consistent with the heat map, given that there
          aren&rsquo;t as many sightings along the coastal waters in the fall and early winter
          months.
        </Text>
        <Text prose>
          How could shipping routes be adjusted given the nature of gray whale migrations? One
          solution could be re-routing ships based on the time of the year, or shipping certain
          commodities during months that avoid the migration. Another option is to slow down
          cruising speeds when gray whales are migrating through the area. For example, the Los
          Angeles port could require ships to use the re-route option displayed and slow down
          cruising speed from January to March, and return to normal outside of those months. To
          avoid harming gray whale migrations, oil tankers could avoid certain months when an oil
          spill could be harmful. However, it&rsquo;s important to maintain a balance, as this
          could reduce supply and increase prices for those products.
        </Text>
      </PostSection>

      <PostSection id="acknowledgements" title="Acknowledgements">
        <Text prose>
          There are several limitations to the data presented in this analysis that should be taken
          into consideration. Firstly, the recommendations made are solely based on the data-set
          provided. It&rsquo;s important to acknowledge that the marine ecosystem is much more
          complex than the two whale species sightings and shipping data that were used in this
          study. While sightings data provides valuable insight into whale behavior, the nature of
          a sighting vs gps tracking has limitations as whales spend most of their time out of
          sight from humans, making it difficult to observe their migratory patterns accurately.
          Additionally, the majority of sightings occur in populated areas or where specific
          scientific studies occured, which could introduce biases in the data. It&rsquo;s also
          worth noting that the shipping data used in this analysis is only for the west coast.
          While this was a deliberate choice made to keep the project scope manageable, it does
          limit looking into other regions.
        </Text>
      </PostSection>

      <PostSection id="conclusion" title="Conclusion">
        <Text prose>
          In conclusion, the issue of shipping routes intersecting with whale habitats is a complex
          and challenging problem that requires careful consideration and evaluation of available
          data. By analyzing datasets on whale sightings and global shipping traffic density, we
          can gain a better understanding of how human activities impact whale behavior and their
          habitats. The findings suggest that rerouting shipping lanes in critical whale habitats
          can reduce the risk of ship strikes and noise pollution and minimize the disturbance of
          high-density whale populations.
        </Text>
        <Text prose>
          While our analysis is just one small step towards protecting these magnificent creatures
          and their habitats, we hope that our findings will contribute to the ongoing conversation
          on how to mitigate the impacts of human activities on marine life. By using data-driven
          recommendations, we can work towards a more sustainable and responsible approach to
          maritime transportation that respects the natural world and preserves its beauty for
          generations to come.
        </Text>
      </PostSection>

      <PostSection id="references" title="References">
        <Text prose>Links to data and articles:</Text>
        <Stack gap={2} as="ul" className="post-links">
          {REFERENCES.map((reference) => (
            <Stack as="li" key={reference.href}>
              <Link to={reference.href} external>
                {reference.label}
              </Link>
            </Stack>
          ))}
        </Stack>
      </PostSection>
    </Stack>
  );
}
