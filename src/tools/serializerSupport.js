const registry = {};

export function addToSerializerRegistry(obj) {
  for (let fnName in obj) {

    if (registry[fnName] !== undefined) {
      throw new Error(`Multiple functions named ${name} added to serializer registry`);
    }

    registry[fnName] = obj[fnName];
  }
}

export function functionToReference(fn) {
  if (fn === null) return null;

  // This could alternatively be done with a Map where the keys are functions,
  // but it's such an infrequently-called helper, why spend the extra memory?
  for (let i in registry) {
    if (registry[i] === fn) return i;
  }

  console.error("Serializer registry has no entry for function:", fn);
  throw new Error(`Serializer registry has no entry for function`);
}

export function referenceToFunction(name) {
  if (name === null) return null;

  if (registry[name] === undefined) {
    throw new Error(`Serializer registry has no entry for a function named ${name}`);
  }

  return registry[name];
}
