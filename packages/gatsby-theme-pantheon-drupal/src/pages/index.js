import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import Layout from "../components/layout";
import Card from "gatsby-theme-pantheon-core/src/components/card";

export default () => {
  const data = useStaticQuery(graphql`
    {
      drupal {
        articles: nodeQuery(
          filter: {
            conditions: [
              { operator: EQUAL, field: "type", value: ["article"] }
              { operator: EQUAL, field: "status", value: ["1"] }
            ]
          }
          sort: [{ field: "title", direction: ASC }]
        ) {
          entities {
            uuid: entityUuid
            id: entityId
            entityUrl {
              path
            }
            entityCreated(format: "M d, yy")
            ... on Drupal_Node {
              title
            }
            ... on Drupal_NodeArticle {
              body {
                processed
              }
              fieldFeaturedImage {
                entity {
                  ...MediaImage
                }
              }
            }
          }
        }
      }
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  const articles = data.drupal.articles.entities;
  const sitename = data.site.siteMetadata.title;

  return (
    <Layout title="Drupal Posts" sitename={sitename}>
      <Layout.Container flex>
        {articles &&
          articles.map(article => (
            <Card className="w-full lg:w-1/3">
              <Card.Intro>{article.entityCreated}</Card.Intro>
              {article.fieldFeaturedImage && (
                <>
                  <Card.Image
                    to={article.entityUrl.path}
                    image={
                      article.fieldFeaturedImage.entity.gatsbyImageFile
                        .childImageSharp
                    }
                  />
                </>
              )}
              <Card.Title>{article.title}</Card.Title>
              {/* <Card.Text>{article.body.processed}</Card.Text> */}
              <Card.Link to={article.entityUrl.path}>Read more...</Card.Link>
            </Card>
          ))}
      </Layout.Container>
    </Layout>
  );
};
