export const categories = [
  {
    name: "cars",
    image:
      "https://i.pinimg.com/750x/eb/47/44/eb4744eaa3b3ccd89749fa3470e2b0de.jpg",
  },
  {
    name: "fitness",
    image:
      "https://i.pinimg.com/236x/25/14/29/251429345940a47490cc3d47dfe0a8eb.jpg",
  },
  {
    name: "wallpapers",
    image:
      "https://i.pinimg.com/236x/03/48/b6/0348b65919fcbe1e4f559dc4feb0ee13.jpg",
  },
  {
    name: "websites",
    image:
      "https://i.pinimg.com/750x/66/b1/29/66b1296d36598122e6a4c5452b5a7149.jpg",
  },
  {
    name: "photo",
    image:
      "https://i.pinimg.com/236x/72/8c/b4/728cb43f48ca762a75da645c121e5c57.jpg",
  },
  {
    name: "food",
    image:
      "https://i.pinimg.com/236x/7d/ef/15/7def15ac734837346dac01fad598fc87.jpg",
  },
  {
    name: "nature",
    image:
      "https://i.pinimg.com/236x/b9/82/d4/b982d49a1edd984c4faef745fd1f8479.jpg",
  },
  {
    name: "art",
    image:
      "https://i.pinimg.com/736x/f4/e5/ba/f4e5ba22311039662dd253be33bf5f0e.jpg",
  },
  {
    name: "travel",
    image:
      "https://i.pinimg.com/236x/fa/95/98/fa95986f2c408098531ca7cc78aee3a4.jpg",
  },
  {
    name: "quotes",
    image:
      "https://i.pinimg.com/236x/46/7c/17/467c17277badb00b638f8ec4da89a358.jpg",
  },
  {
    name: "cats",
    image:
      "https://i.pinimg.com/236x/6c/3c/52/6c3c529e8dadc7cffc4fddedd4caabe1.jpg",
  },
  {
    name: "dogs",
    image:
      "https://i.pinimg.com/236x/1b/c8/30/1bc83077e363db1a394bf6a64b071e9f.jpg",
  },
  {
    name: "others",
    image:
      "https://i.pinimg.com/236x/2e/63/c8/2e63c82dfd49aca8dccf9de3f57e8588.jpg",
  },
];

/**
 * Takes logged in userId as Params.
 * @param userId String
 * @returns query
 */
export const userQuery = (userId) => {
  const query = `*[_type == 'user' && _id == '${userId}']`;
  return query;
};

export const searchQuery = (searchTerm, tab = "pins") => {
  let query = ``;

  if (tab === "pins") {
    query = `*[_type == 'pins' && ( title match '${searchTerm}*' || about match '${searchTerm}*' )]{
    image {
      asset -> {
        url
      }
    },
    _id,
    destination,
    postedBy -> { _id, name, image },
    wishlists[] -> {
     _id,
    },
    _createdAt
    }`;
  } else if (tab === "accounts") {
    query = `*[_type == 'user' && ( name match '*${searchTerm}*' )]{
      name,
      image {
        asset -> {
          url
        }
      },
      _id,
      _createdAt
      }`;
  }
  // const query = `*[_type == 'pins' && ( title match '${searchTerm}*' || category match '${searchTerm}*' || about match '${searchTerm}*' )]{
  //   image {
  //     asset -> {
  //       url
  //     }
  //   },
  //   _id,
  //   destination,
  //   postedBy -> {
  //     _id,
  //     name,
  //     image
  //   },
  // wishlists[] -> {
  //  _id,
  // },
  // }`;

  return query;
};

export const feedQuery = `*[_type == "pins"] | order(_createdAt desc){
    image {
      asset -> {
        url
      }
    },
    _id,
    destination,
    postedBy -> {
     _id,
     name,
     image
    },
    wishlists[] -> {
      _id
    },
  }`; //new pins will be at the top

/**
 *Takes pinId to as Params.
 * @param pinId String
 * @returns query
 */
export const pinDetailQuery = (pinId) => {
  const query = `*[_type == "pins" && _id == '${pinId}']{
    image{
      asset -> {
        url
      }
    },
    _id,
    title,
    about,
    category,
    destination,
    _createdAt,
    _updatedAt,
    postedBy -> {
      _id,
      name,
      image
    },
    wishlists[] -> {
      _id
    },
    likes[]-> {
      _id,
      name,
      image
    },
    dislikes[]-> {
      _id,
      name,
      image
    },
    likesCount,
    dislikesCount,
    sharesCount,
    downloadCount
  }`;
  return query;
};

export const pinDetailMorePinQuery = (pin) => {
  const query = `*[_type == "pins" && category == '${pin.category}' && _id != '${pin._id}' ]{
    image{
      asset->{
        url,
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      name,
      image
    },
    wishlists[] -> {
      _id
    },
  }`;
  return query;
};

export const userCreatedPinsQuery = (userId) => {
  const query = `*[_type == 'pins' && postedBy->_id == '${userId}'] | order(_createdAt desc){
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      name,
      image
    },
    wishlists[]->{
      _id
    },
  }`;
  return query;
};

// Here -> means it is referencing to the document
// So it will fetch the details from the referenced document

export const userSavedPinsQuery = (userId) => {
  const query = `*[_type == 'pins' && '${userId}' in wishlists[]->_id ] | order(_createdAt desc) {
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      name,
      image
    },
    wishlists[]->{
      _id
    },
  }`;
  return query;
};

export const getCommentsQuery = (pinId) => {
  const query = `*[_type == 'comments' && pinId._ref == '${pinId}'] | order(_createdAt desc){
    _id,
    postedBy->{
      _id,
      image,
      name
    },
    comment
  }`;
  return query;
};
